// ============================================================
// MISSION LIST - DeepEyeTyping Dashboard
// ============================================================

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Zap, Target, Clock, Type } from 'lucide-react';
import type { Mission } from 'core/src/types/engagement';

interface MissionListProps {
    missions: Mission[];
}

const iconMap = {
    wpm: Zap,
    accuracy: Target,
    time: Clock,
    chars: Type,
    sessions: CheckCircle2,
};

export function MissionList({ missions }: MissionListProps) {
    const completedCount = missions.filter(m => m.completed).length;

    return (
        <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target size={18} className="text-neon-cyan" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">
                        Daily Missions
                    </span>
                </div>
                <span className="text-[10px] text-white/30">
                    {completedCount}/{missions.length}
                </span>
            </div>

            <div className="space-y-3">
                {missions.map((mission) => {
                    const Icon = iconMap[mission.type];
                    const progress = mission.target > 0
                        ? Math.min(100, Math.round((mission.current / mission.target) * 100))
                        : 0;

                    return (
                        <MissionItem
                            key={mission.id}
                            mission={mission}
                            progress={progress}
                            icon={Icon}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface MissionItemProps {
    mission: Mission;
    progress: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const MISSION_INIT = { opacity: 0, x: -10 };
const MISSION_ANIM = { opacity: 1, x: 0 };
const WIDTH_INIT = { width: 0 };
const WIDTH_TRANS = { duration: 0.5, ease: 'easeOut' as const };

function MissionItem({ mission, progress, icon: Icon }: MissionItemProps) {
    const widthAnim = useMemo(() => ({ width: `${progress}%` }), [progress]);
    return (
        <motion.div
            initial={MISSION_INIT}
            animate={MISSION_ANIM}
            className={`p-3 rounded-xl border transition-all ${mission.completed
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${mission.completed ? 'text-green-500' : 'text-white/40'}`}>
                    {mission.completed ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <Circle size={16} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <span className={`text-xs font-bold leading-tight ${mission.completed ? 'text-green-400' : 'text-white'} break-words min-w-0 flex-1`}>
                            {mission.title}
                        </span>
                        <span className="text-[10px] text-neon-cyan font-bold shrink-0 mt-0.5 whitespace-nowrap ml-1">
                            +{mission.xpReward} XP
                        </span>
                    </div>

                    <p className="text-[10px] text-white/40 mb-2">
                        {mission.description}
                    </p>

                    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={WIDTH_INIT}
                            animate={widthAnim}
                            transition={WIDTH_TRANS}
                            className={`absolute left-0 top-0 h-full rounded-full ${mission.completed ? 'bg-green-500' : 'bg-neon-cyan'
                                }`}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-white/30 flex items-center gap-1">
                            <Icon size={10} />
                            {mission.current}/{mission.target}
                        </span>
                        <span className="text-[9px] text-white/30">
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
