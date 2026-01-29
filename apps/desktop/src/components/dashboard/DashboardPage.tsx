import { useStats, useAuthStore } from '../../../../../packages/core'; // Relative import
import { LineChart, Activity, Zap, Target } from 'lucide-react';

export const DashboardPage = () => {
    const { user, signInWithGoogle } = useAuthStore();
    const { sessions, loading } = useStats();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                <div className="w-24 h-24 rounded-full bg-glass-200 flex items-center justify-center animate-pulse">
                    <Activity size={48} className="text-white/20" />
                </div>
                <h2 className="text-3xl font-bold">Authentication Required</h2>
                <p className="text-white/50 max-w-md">
                    To view detailed analytics and history, please connect your neural identity.
                </p>
                <button
                    onClick={() => signInWithGoogle()}
                    className="btn-primary"
                >
                    Connect Identity
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">

            {/* Welcome Header */}
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Welcome back, <span className="text-neon-cyan">{user.displayName?.split(' ')[0]}</span>
                </h2>
                <p className="text-white/50">Your neural link is stable.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={64} />
                    </div>
                    <span className="text-sm uppercase tracking-widest text-white/40">Avg Speed</span>
                    <span className="text-4xl font-mono font-bold text-neon-cyan">
                        {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length) : '-'} <span className="text-lg">WPM</span>
                    </span>
                </div>

                <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={64} />
                    </div>
                    <span className="text-sm uppercase tracking-widest text-white/40">Accuracy</span>
                    <span className="text-4xl font-mono font-bold text-neon-purple">
                        {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) : '-'} <span className="text-lg">%</span>
                    </span>
                </div>

                <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LineChart size={64} />
                    </div>
                    <span className="text-sm uppercase tracking-widest text-white/40">Total Sessions</span>
                    <span className="text-4xl font-mono font-bold text-white">
                        {sessions.length}
                    </span>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-neon-cyan" />
                    Recent Protocols
                </h3>

                {loading ? (
                    <div className="text-center py-10 text-white/30">Syncing...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10 text-white/30">No training data found. Start a session!</div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-white/30 border-b border-glass-200 text-sm">
                                <th className="pb-3 pl-2">Mode</th>
                                <th className="pb-3">WPM</th>
                                <th className="pb-3">Accuracy</th>
                                <th className="pb-3">Errors</th>
                                <th className="pb-3 text-right pr-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id} className="border-b border-glass-100 hover:bg-glass-100 transition-colors">
                                    <td className="py-4 pl-2 font-medium text-white/80 capitalize">{session.mode}</td>
                                    <td className="py-4 font-mono text-neon-cyan">{session.wpm}</td>
                                    <td className="py-4 font-mono text-neon-purple">{session.accuracy}%</td>
                                    <td className="py-4 font-mono text-white/60">{session.errorCount}</td>
                                    <td className="py-4 text-right pr-2 text-white/40 text-sm">
                                        {session.timestamp?.seconds ? new Date(session.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};
