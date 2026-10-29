import { logEvent, setUserProperties } from 'firebase/analytics';
import { getFirebaseAnalytics } from './firebase';

export interface QueuedAnalyticsEvent {
  id: string;
  name: string;
  params: Record<string, string | number | boolean>;
  timestamp: number;
}

const STORAGE_KEYS = {
  FIRST_VISIT: 'sudan_bban_first_visit_timestamp',
  LAST_VISIT_DATE: 'sudan_bban_last_active_date',
  VISIT_COUNT: 'sudan_bban_visit_count',
  OFFLINE_QUEUE: 'sudan_bban_analytics_queue',
} as const;

/**
 * Retrieves the pending offline events queue from localStorage.
 */
function getOfflineQueue(): QueuedAnalyticsEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves the pending offline events queue to localStorage.
 */
function saveOfflineQueue(queue: QueuedAnalyticsEvent[]): void {
  try {
    // Keep maximum 100 recent events to avoid overflowing localStorage
    const trimmed = queue.slice(-100);
    window.localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[BBAN Analytics] Failed to persist offline queue:', err);
  }
}

/**
 * Enqueues an event for later synchronization when online.
 */
function enqueueOfflineEvent(name: string, params: Record<string, string | number | boolean>): void {
  const queue = getOfflineQueue();
  const event: QueuedAnalyticsEvent = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    params,
    timestamp: Date.now(),
  };
  queue.push(event);
  saveOfflineQueue(queue);
  console.info(`[BBAN Analytics (Offline Queue)] Event saved: "${name}"`, params);
}

/**
 * Synchronizes any pending offline analytics events when connectivity is restored.
 */
export async function syncOfflineAnalyticsQueue(): Promise<number> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 0;
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return 0;
  }

  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    // Firebase is not initialized, keep queue safely in localStorage
    return 0;
  }

  console.info(`[BBAN Analytics] Synchronizing ${queue.length} offline event(s)...`);
  let syncedCount = 0;

  for (const event of queue) {
    try {
      const syncDelaySeconds = Math.max(0, Math.round((Date.now() - event.timestamp) / 1000));
      logEvent(analytics, event.name, {
        ...event.params,
        was_offline: true,
        original_timestamp: event.timestamp,
        sync_delay_sec: syncDelaySeconds,
      });
      syncedCount++;
    } catch (err) {
      console.warn('[BBAN Analytics] Failed to send queued event:', event.name, err);
      // Stop and keep remaining events in queue
      break;
    }
  }

  // Remove the successfully synced events
  const remaining = queue.slice(syncedCount);
  saveOfflineQueue(remaining);

  if (syncedCount > 0) {
    console.info(`[BBAN Analytics] Successfully synchronized ${syncedCount} offline event(s).`);
  }

  return syncedCount;
}

/**
 * Checks if DebugView mode should be enabled.
 * Triggered in development mode or by appending ?debug=true to the URL.
 */
function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(
      import.meta.env.DEV ||
      window.location.search.includes('debug=true') ||
      window.location.search.includes('debug_mode=1') ||
      window.localStorage.getItem('sudan_bban_debug_analytics') === 'true'
    );
  } catch {
    return false;
  }
}

/**
 * Main function to record an analytics event.
 * Dispatches immediately if online, or queues locally if offline.
 */
export async function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
): Promise<void> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const debug = isDebugMode();

  const finalParams: Record<string, string | number | boolean> = {
    ...params,
    ...(debug ? { debug_mode: true } : {}),
  };

  if (!isOnline) {
    enqueueOfflineEvent(name, { ...finalParams, is_offline: true });
    return;
  }

  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    enqueueOfflineEvent(name, { ...finalParams, is_offline: false });
    return;
  }

  try {
    logEvent(analytics, name, {
      ...finalParams,
      is_offline: false,
    });
    // If we are online and sent an event, also check if there are previously queued offline events to flush
    syncOfflineAnalyticsQueue().catch(() => {});
  } catch (err) {
    console.warn('[BBAN Analytics] Error logging event, queueing offline:', err);
    enqueueOfflineEvent(name, finalParams);
  }
}

let isSessionTracked = false;

/**
 * Tracks User Session, Daily/Monthly Active Users (DAU/MAU), and New vs Returning Users.
 * Safe against React StrictMode duplicate invocations.
 */
export async function trackUserSession(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isSessionTracked) return;
  isSessionTracked = true;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // Check New vs Returning User
  const firstVisitRaw = window.localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
  const isNewUser = !firstVisitRaw;

  let visitCount = 1;
  const visitCountRaw = window.localStorage.getItem(STORAGE_KEYS.VISIT_COUNT);
  if (visitCountRaw) {
    visitCount = parseInt(visitCountRaw, 10) + 1;
  }
  window.localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, visitCount.toString());

  const lastActiveDate = window.localStorage.getItem(STORAGE_KEYS.LAST_VISIT_DATE);
  const isNewDayActive = lastActiveDate !== todayStr;
  window.localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, todayStr);

  const analytics = await getFirebaseAnalytics();

  if (isNewUser) {
    window.localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, now.getTime().toString());
    if (analytics) {
      try {
        setUserProperties(analytics, {
          user_type: 'new',
          first_visit_date: todayStr,
        });
      } catch {}
    }

    trackEvent('new_user_first_open', {
      user_type: 'new',
      platform: 'web_pwa',
      date: todayStr,
    });
  } else {
    const firstVisitTime = parseInt(firstVisitRaw, 10);
    const daysSinceFirstVisit = Math.floor((now.getTime() - firstVisitTime) / (1000 * 60 * 60 * 24));

    if (analytics) {
      try {
        setUserProperties(analytics, {
          user_type: 'returning',
          total_visits: visitCount,
          days_active: daysSinceFirstVisit,
        });
      } catch {}
    }

    trackEvent('returning_user_session', {
      user_type: 'returning',
      days_since_first_visit: daysSinceFirstVisit,
      visit_count: visitCount,
      platform: 'web_pwa',
      date: todayStr,
    });
  }

  // Track Daily Active User event if this is the first interaction today
  if (isNewDayActive) {
    trackEvent('daily_active_user', {
      activity_date: todayStr,
      activity_month: currentMonthStr,
      is_new_user: isNewUser,
      visit_number: visitCount,
    });
  }

  // Standard Firebase app_open event
  trackEvent('app_open', {
    date: todayStr,
    platform: 'web_pwa',
    user_type: isNewUser ? 'new' : 'returning',
  });

  // Standard session start event
  trackEvent('app_session_start', {
    date: todayStr,
    screen: 'converter_home',
  });

  // Attempt to sync any offline events
  syncOfflineAnalyticsQueue().catch(() => {});
}

/**
 * Tracks a successful BBAN conversion with bank metadata.
 * Custom event name: "bban_conversion"
 * PRIVACY NOTICE: Never logs the actual user bank account number or generated BBAN.
 */
export function trackBBANConversion(data: {
  bankId: string;
  bankName: string;
  accountLength: number;
  hasSuffix: boolean;
}): void {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  trackEvent('bban_conversion', {
    bank_id: data.bankId,
    bank_name: data.bankName,
    account_length: data.accountLength,
    has_suffix: data.hasSuffix,
    calculation_mode: isOnline ? 'online' : 'offline',
    conversion_status: 'success',
  });
}

/**
 * Backward compatibility aliases
 */
export const trackBBANCalculation = trackBBANConversion;
export const trackBBANCalculationSuccess = trackBBANConversion;

// Automatically listen for connection restore to synchronize offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.info('[BBAN Analytics] Internet restored. Triggering offline queue synchronization...');
    syncOfflineAnalyticsQueue().catch(() => {});
  });
}
