// ============================================================
// SESSION TEMPLATE SELECTOR - DeepEyeTyping
// ============================================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Flame,
    Zap,
    Target,
    Clock,
    Activity,
    ChevronRight,
    Lock,
} from 'lucide-react';
import { getTemplatesForLevel, SESSION_TEMPLATES } from 'core';
import type { SessionTemplateId, SessionTemplate } from 'core';

interface SessionTemplateSelectorProps {
    userLevel: number;
    onSelect: (templateId: SessionTemplateId) => void;
}

const iconMap = {
    warmup: Flame,
    focused: Target,
    boss_run: Zap,
    zen: Activity,
    sprint: Clock,
};

const colorMap: Record<SessionTemplateId, string> = {
    warmup: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
    focused: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5',
    boss_run: 'text-red-400 border-red-400/30 bg-red-400/5',
    zen: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
    sprint: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
};

export function SessionTemplateSelector({
    userLevel,
    onSelect,
}: SessionTemplateSelectorProps) {
    const availableTemplates = getTemplatesForLevel(userLevel);

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-black italic text-white mb-2">
                    Choose Your Protocol
                </h2>
                <p className="text-white/50 text-sm">
                    Select a training session type
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(SESSION_TEMPLATES).map((template) => {
                    const isUnlocked = availableTemplates.includes(template.id);
                    const Icon = iconMap[template.id];
                    const colors = colorMap[template.id];

                    return (
                        <TemplateCardWrapper
                            key={template.id}
                            template={template}
                            icon={Icon}
                            colors={colors}
                            isUnlocked={isUnlocked}
                            onSelect={onSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface TemplateCardProps {
    template: SessionTemplate;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    colors: string;
    isUnlocked: boolean;
    onSelect: () => void;
}

const HOVER_ANIM = { scale: 1.02 };
const TAP_ANIM = { scale: 0.98 };
const NO_ANIM = {};
const LABEL_INIT = { opacity: 0, y: 10 };
const LABEL_ANIM = { opacity: 1, y: 0 };

function TemplateCardWrapper({ template, icon, colors, isUnlocked, onSelect }: { template: SessionTemplate, icon: React.ElementType<{ size?: number; className?: string }>, colors: string, isUnlocked: boolean, onSelect: (id: SessionTemplateId) => void }) {
    const handleSelect = useCallback(() => {
        if (isUnlocked) onSelect(template.id);
    }, [isUnlocked, onSelect, template.id]);

    return <TemplateCard template={template} icon={icon} colors={colors} isUnlocked={isUnlocked} onSelect={handleSelect} />;
}

function TemplateCard({
    template,
    icon: Icon,
    colors,
    isUnlocked,
    onSelect,
}: TemplateCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <motion.button
            onClick={onSelect}
            disabled={!isUnlocked}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={isUnlocked ? HOVER_ANIM : NO_ANIM}
            whileTap={isUnlocked ? TAP_ANIM : NO_ANIM}
            className={`
                relative p-5 rounded-2xl border-2 text-left transition-all duration-300
                ${colors}
                ${isUnlocked ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-50'}
            `}
        >
            {!isUnlocked && (
                <div className="absolute top-3 right-3">
                    <Lock size={16} className="text-white/40" />
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className={`
                    p-3 rounded-xl
                    ${isUnlocked ? 'bg-white/10' : 'bg-white/5'}
                `}>
                    <Icon size={24} className={isUnlocked ? 'text-white' : 'text-white/30'} />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">
                        {template.name}
                    </h3>
                    <p className="text-white/50 text-xs mb-3">
                        {template.description}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {template.duration.min / 60}-{template.duration.max / 60} min
                        </span>
                        <span className="capitalize">{template.difficulty}</span>
                    </div>
                </div>
            </div>

            {isUnlocked && isHovered && (
                <motion.div
                    initial={LABEL_INIT}
                    animate={LABEL_ANIM}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                >
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs font-bold">
                        Start <ChevronRight size={12} />
                    </div>
                </motion.div>
            )}
        </motion.button>
    );
}
