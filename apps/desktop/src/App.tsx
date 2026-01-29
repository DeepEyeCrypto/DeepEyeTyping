import { AppShell } from './components/layout/AppShell';
import { TypingArea } from './components/typing/TypingArea';
import { LessonSelector } from './components/typing/LessonSelector';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { useTypingStore, useNavigationStore } from '../../../packages/core';

function App() {
  const { wpm, accuracy } = useTypingStore();
  const { currentView } = useNavigationStore();

  return (
    <AppShell>
      <div className="flex flex-col h-full items-center gap-8 w-full">

        {currentView === 'dashboard' && <DashboardPage />}

        {currentView === 'train' && (
          <>
            <div className="w-full max-w-5xl flex justify-between items-end mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                  Neural Training Protocol
                </h2>
                <p className="text-sm text-white/50">Select a module to begin.</p>
              </div>

              <div className="flex gap-6">
                <div className="glass-panel px-6 py-2 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-white/40 uppercase tracking-widest">WPM</span>
                  <span className="text-2xl font-mono font-bold text-neon-cyan">{wpm}</span>
                </div>
                <div className="glass-panel px-6 py-2 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-white/40 uppercase tracking-widest">ACCURACY</span>
                  <span className="text-2xl font-mono font-bold text-neon-purple">{accuracy}%</span>
                </div>
              </div>
            </div>

            {/* Lesson Selector Row */}
            <div className="w-full max-w-5xl mb-6 animate-in fade-in delay-75 duration-500">
              <LessonSelector />
            </div>

            <div className="w-full animate-in fade-in delay-150 duration-500">
              <TypingArea />
            </div>
          </>
        )}

        {currentView === 'settings' && <SettingsPage />}

        {currentView === 'stats' && (
          <div className="flex items-center justify-center h-full text-white/30 text-xl font-mono">
            Advanced Stats Module Locked
          </div>
        )}

      </div>
    </AppShell>
  );
}

export default App;
