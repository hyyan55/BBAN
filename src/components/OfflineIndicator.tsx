import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-40 flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 px-4 py-3 text-xs font-medium text-white shadow-lg"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
      <span>وضع عدم الاتصال بالإنترنت نشط — التطبيق يعمل بالكامل محلياً.</span>
    </div>
  );
};
