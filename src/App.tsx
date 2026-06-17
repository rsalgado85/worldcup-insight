import { RouterProvider } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { router } from '@/routes';
import { PlayerModal } from '@/components/modals/PlayerModal';

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

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'WC_INSIGHT_CACHE',
  throttleTime: 1000,
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist teams/groups/stadiums — skip matches (they change constantly)
            const staticKeys = ['teams', 'groups', 'stadiums', 'players'];
            return staticKeys.includes(query.queryKey[0] as string);
          },
        },
      }}
      onSuccess={() => queryClient.resumePausedMutations()}
    >
      <RouterProvider router={router} />
      <PlayerModal />
    </PersistQueryClientProvider>
  );
}
