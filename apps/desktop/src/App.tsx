import { useEffect, Suspense, lazy } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useNavigationStore, useAuthStore, useProgressSync } from 'core';

// Lazy Load Main Views
const DashboardPage = lazy(() => import('./components/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })));
const TrainingPage = lazy(() => import('./components/typing/TrainingPage').then(module => ({ default: module.TrainingPage })));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const StatsPage = lazy(() => import('./components/stats/StatsPage').then(module => ({ default: module.StatsPage })));
const AchievementsPage = lazy(() => import('./components/achievements/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const LeaderboardPage = lazy(() => import('./components/leaderboard/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));

function App() {
  const { currentView } = useNavigationStore();
  const { user, initialize, signInAnonymously, loading } = useAuthStore();
  useProgressSync(); // Initialize Sync

  useEffect(() => {
    const unsub = initialize();
    return () => unsub();
  }, [initialize]);

  // Auto-sign in anonymously if no user and not loading
  useEffect(() => {
    if (!loading && !user) {
      signInAnonymously();
    }
  }, [user, loading, signInAnonymously]);

  return (
    <AppShell>
      <div className="flex flex-col h-full items-center gap-8 w-full">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
          </div>
        }>
          {currentView === 'dashboard' && <DashboardPage />}

          {currentView === 'train' && <TrainingPage />}

          {currentView === 'settings' && <SettingsPage />}

          {currentView === 'stats' && <StatsPage />}

          {currentView === 'achievements' && <AchievementsPage />}
          {currentView === 'leaderboard' && <LeaderboardPage />}
        </Suspense>
      </div>
    </AppShell>
  );
}

export default App;
