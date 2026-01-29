import { LESSONS, useTypingStore, Lesson } from '../../../../../packages/core';
import { BookOpen, Star, Lock } from 'lucide-react';

export const LessonSelector = () => {
    const { setText, reset } = useTypingStore();

    const handleSelect = (lesson: Lesson) => {
        setText(lesson.text);
        reset();
    };

    return (
        <div className="w-full flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {LESSONS.map((lesson) => (
                <button
                    key={lesson.id}
                    onClick={() => handleSelect(lesson)}
                    className="glass-panel min-w-[200px] p-4 rounded-xl flex flex-col gap-2 hover:bg-glass-200 hover:scale-105 transition-all text-left"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">
                            {lesson.category}
                        </span>
                        {lesson.difficulty > 2 && <Lock size={14} className="text-white/30" />}
                    </div>

                    <h3 className="font-bold text-white text-lg leading-tight">
                        {lesson.title}
                    </h3>

                    <div className="flex gap-1 mt-auto">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={`${i < lesson.difficulty ? 'text-neon-purple fill-neon-purple' : 'text-white/10'}`}
                            />
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
};
