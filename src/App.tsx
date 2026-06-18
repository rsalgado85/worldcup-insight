import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { router } from '@/routes';
import { PlayerModal } from '@/components/modals/PlayerModal';
import { SplashScreen } from '@/components/common/SplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      placeholderData: (prev: any) => prev,
    },
  },
});

// Safe localStorage wrapper — catches corrupted cache gracefully
function safeStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  return {
    getItem: (key: string) => {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    setItem: (key: string, value: string) => {
      try { window.localStorage.setItem(key, value); } catch { /* quota exceeded, ignore */ }
    },
    removeItem: (key: string) => {
      try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    },
    get length() { return window.localStorage.length; },
    key: (index: number) => window.localStorage.key(index),
    clear: () => { try { window.localStorage.clear(); } catch { /* ignore */ } },
  };
}

const persister = createSyncStoragePersister({
  storage: safeStorage(),
  key: 'WC_INSIGHT_CACHE',
  throttleTime: 1000,
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  // Show splash on first visit, skip if returning (has cached data)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('wc_splash_shown');
    if (hasVisited) {
      setShowSplash(false);
      setSplashDone(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('wc_splash_shown', '1');
    setSplashDone(true);
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const staticKeys = ['teams', 'groups', 'stadiums', 'players'];
            return staticKeys.includes(query.queryKey[0] as string);
          },
        },
      }}
      onSuccess={() => queryClient.resumePausedMutations()}
    >
      {/* Splash screen — only on first visit per session */}
      {!splashDone && (
        <SplashScreen
          isVisible={showSplash}
          onComplete={handleSplashComplete}
          language="es"
        />
      )}

      {/* Main app — renders immediately behind splash */}
      <RouterProvider router={router} />
      <PlayerModal />
    </PersistQueryClientProvider>
  );
}
