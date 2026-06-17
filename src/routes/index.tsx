import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ErrorPage } from '@/components/common/ErrorPage';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const MatchesPage = lazy(() => import('@/pages/MatchesPage').then(m => ({ default: m.MatchesPage })));
const LiveScoresPage = lazy(() => import('@/pages/LiveScoresPage').then(m => ({ default: m.LiveScoresPage })));
const StandingsPage = lazy(() => import('@/pages/StandingsPage').then(m => ({ default: m.StandingsPage })));
const GroupsPage = lazy(() => import('@/pages/GroupsPage').then(m => ({ default: m.GroupsPage })));
const TeamsPage = lazy(() => import('@/pages/TeamsPage').then(m => ({ default: m.TeamsPage })));
const PlayersPage = lazy(() => import('@/pages/PlayersPage').then(m => ({ default: m.PlayersPage })));
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage').then(m => ({ default: m.StatisticsPage })));
const TopScorersPage = lazy(() => import('@/pages/TopScorersPage').then(m => ({ default: m.TopScorersPage })));
const StadiumsPage = lazy(() => import('@/pages/StadiumsPage').then(m => ({ default: m.StadiumsPage })));
const CountriesPage = lazy(() => import('@/pages/CountriesPage').then(m => ({ default: m.CountriesPage })));
const PredictionsPage = lazy(() => import('@/pages/PredictionsPage').then(m => ({ default: m.PredictionsPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const DonatePage = lazy(() => import('@/pages/DonatePage').then(m => ({ default: m.DonatePage })));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#0033A0] border-t-transparent rounded-full animate-spin" />
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
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: 'matches', element: <SuspenseWrapper><MatchesPage /></SuspenseWrapper> },
      { path: 'live-scores', element: <SuspenseWrapper><LiveScoresPage /></SuspenseWrapper> },
      { path: 'standings', element: <SuspenseWrapper><StandingsPage /></SuspenseWrapper> },
      { path: 'groups', element: <SuspenseWrapper><GroupsPage /></SuspenseWrapper> },
      { path: 'teams', element: <SuspenseWrapper><TeamsPage /></SuspenseWrapper> },
      { path: 'players', element: <SuspenseWrapper><PlayersPage /></SuspenseWrapper> },
      { path: 'statistics', element: <SuspenseWrapper><StatisticsPage /></SuspenseWrapper> },
      { path: 'top-scorers', element: <SuspenseWrapper><TopScorersPage /></SuspenseWrapper> },
      { path: 'stadiums', element: <SuspenseWrapper><StadiumsPage /></SuspenseWrapper> },
      { path: 'countries', element: <SuspenseWrapper><CountriesPage /></SuspenseWrapper> },
      { path: 'predictions', element: <SuspenseWrapper><PredictionsPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'donate', element: <SuspenseWrapper><DonatePage /></SuspenseWrapper> },
    ],
  },
]);
