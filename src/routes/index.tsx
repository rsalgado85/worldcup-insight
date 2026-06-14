import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ErrorPage } from '@/components/common/ErrorPage';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CharactersPage = lazy(() => import('@/pages/CharactersPage').then(m => ({ default: m.CharactersPage })));
const BossesPage = lazy(() => import('@/pages/BossesPage').then(m => ({ default: m.BossesPage })));
const ItemsPage = lazy(() => import('@/pages/ItemsPage').then(m => ({ default: m.ItemsPage })));
const DungeonsPage = lazy(() => import('@/pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const LorePage = lazy(() => import('@/pages/LorePage').then(m => ({ default: m.LorePage })));
const WeaponsPage = lazy(() => import('@/pages/WeaponsPage').then(m => ({ default: m.WeaponsPage })));
const GamesPage = lazy(() => import('@/pages/VideogamesPage').then(m => ({ default: m.VideogamesPage })));
const MapsPage = lazy(() => import('@/pages/MapsPage').then(m => ({ default: m.MapsPage })));
const CreaturesPage = lazy(() => import('@/pages/CreaturesPage').then(m => ({ default: m.CreaturesPage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
    </div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'characters', element: <SuspenseWrapper><CharactersPage /></SuspenseWrapper> },
      { path: 'bosses', element: <SuspenseWrapper><BossesPage /></SuspenseWrapper> },
      { path: 'items', element: <SuspenseWrapper><ItemsPage /></SuspenseWrapper> },
      { path: 'dungeons', element: <SuspenseWrapper><DungeonsPage /></SuspenseWrapper> },
      { path: 'lore', element: <SuspenseWrapper><LorePage /></SuspenseWrapper> },
      { path: 'weapons', element: <SuspenseWrapper><WeaponsPage /></SuspenseWrapper> },
      { path: 'games', element: <SuspenseWrapper><GamesPage /></SuspenseWrapper> },
      { path: 'maps', element: <SuspenseWrapper><MapsPage /></SuspenseWrapper> },
      { path: 'creatures', element: <SuspenseWrapper><CreaturesPage /></SuspenseWrapper> },
      { path: 'favorites', element: <SuspenseWrapper><FavoritesPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
    ],
  },
]);
