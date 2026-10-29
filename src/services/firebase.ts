import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

/**
 * Sanitizes Firebase API key:
 * - Trims whitespaces and accidental internal spaces
 * - Fixes common typo where uppercase 'I' was entered as lowercase 'l' (AlzaSy -> AIzaSy)
 */
function sanitizeApiKey(key: string): string {
  if (!key) return '';
  let cleaned = key.trim().replace(/\s+/g, '');
  if (cleaned.startsWith('AlzaSy')) {
    cleaned = 'AIzaSy' + cleaned.substring(6);
  }
  return cleaned;
}

function sanitizeString(val: string | undefined): string {
  return (val || '').trim();
}

/**
 * Firebase Web Configuration
 * Values are loaded from Vite environment variables (.env / .env.local) and sanitized.
 */
export const firebaseConfig = {
  apiKey: sanitizeApiKey(import.meta.env.VITE_FIREBASE_API_KEY || ''),
  authDomain: sanitizeString(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || ''),
  projectId: sanitizeString(import.meta.env.VITE_FIREBASE_PROJECT_ID || ''),
  storageBucket: sanitizeString(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''),
  messagingSenderId: sanitizeString(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
  appId: sanitizeString(import.meta.env.VITE_FIREBASE_APP_ID || ''),
  measurementId: sanitizeString(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''),
};

// Catch any asynchronous background promise rejections from Firebase Installations (e.g. invalid key or network issue)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason || '');
    const isFirebaseError =
      (event.reason && (event.reason.name === 'FirebaseError' || event.reason.code?.startsWith('installations/'))) ||
      reasonStr.includes('installations/request-failed') ||
      reasonStr.includes('API key not valid');

    if (isFirebaseError) {
      console.warn('[BBAN Analytics] Handled Firebase background error gracefully:', event.reason?.message || reasonStr);
      event.preventDefault();
    }
  });
}

let app: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;
let isInitializing = false;

/**
 * Checks if the Firebase configuration contains minimum valid keys.
 */
export function hasValidFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

/**
 * Returns a diagnostic summary of the current Firebase environment configuration.
 */
export function getFirebaseConfigStatus(): {
  isConfigured: boolean;
  configuredKeys: string[];
  missingKeys: string[];
} {
  const keys = [
    'apiKey',
    'projectId',
    'appId',
    'messagingSenderId',
    'measurementId',
    'authDomain',
  ] as const;

  const configuredKeys = keys.filter((k) => Boolean(firebaseConfig[k]));
  const missingKeys = keys.filter((k) => !firebaseConfig[k]);

  return {
    isConfigured: hasValidFirebaseConfig(),
    configuredKeys,
    missingKeys,
  };
}

let isKeyVerified = false;

/**
 * Validates the API key against Google's installations API before initializing Analytics.
 * If rejected, Analytics initialization is gracefully bypassed and the local queue is used.
 */
async function isApiKeyValidForInstallations(
  key: string,
  projectId: string,
  appId: string
): Promise<boolean> {
  if (isKeyVerified) return true;
  if (!key || !projectId || !appId) return false;

  try {
    const res = await fetch(
      `https://firebaseinstallations.googleapis.com/v1/projects/${projectId}/installations`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appId }),
      }
    );
    const text = await res.text();
    if (text.includes('API_KEY_INVALID') || text.includes('API key not valid')) {
      console.warn('[BBAN Analytics] Firebase API Key is not valid. Using local offline analytics queue.');
      return false;
    }
    isKeyVerified = true;
    return true;
  } catch (err) {
    // If network is offline, don't fail, simply return false to run in safe offline mode
    return false;
  }
}

/**
 * Initializes Firebase App and Analytics safely.
 * Returns null if running in an unsupported environment or if config is not yet supplied.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  if (isInitializing) {
    return null;
  }

  if (!hasValidFirebaseConfig()) {
    return null;
  }

  isInitializing = true;

  try {
    // Verify the key before invoking getAnalytics to guarantee zero unhandled 400 errors
    const keyOk = await isApiKeyValidForInstallations(
      firebaseConfig.apiKey,
      firebaseConfig.projectId,
      firebaseConfig.appId
    );

    if (!keyOk) {
      isInitializing = false;
      return null;
    }

    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    const supported = await isSupported().catch(() => false);
    if (supported && app) {
      analyticsInstance = getAnalytics(app);
      console.info('[BBAN Analytics] Firebase Analytics initialized successfully with measurement ID:', firebaseConfig.measurementId || '(default)');
      return analyticsInstance;
    } else {
      console.warn('[BBAN Analytics] Firebase Analytics is not supported in this environment (e.g. cookie/storage restriction).');
    }
  } catch (err) {
    console.warn('[BBAN Analytics] Initialization failed gracefully:', err);
  } finally {
    isInitializing = false;
  }

  return null;
}
