import { useState, useCallback, useMemo, memo } from 'react';
import { useTypingStore, useNavigationStore, db, auth } from 'core';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Code, Play, Save, Cpu, Loader2, Zap, Activity, BarChart3, Globe, Lock } from 'lucide-react';

// --- ANALYSIS UTILS ---

const calculateComplexity = (text: string) => {
    if (!text.length) return { score: 0, level: 'IDLE', stats: { symbols: 0, density: 0 } };

    const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const caps = (text.match(/[A-Z]/g) || []).length;
    const avgWordLen = text.split(/\s+/).reduce((acc, word) => acc + word.length, 0) / (text.split(/\s+/).length || 1);

    // Weighted score
    const score = Math.min(100, (symbols * 5) + (caps * 2) + (avgWordLen * 5));

    let level = 'FOUNDATION';
    if (score > 80) level = 'FLOW STATE';
    else if (score > 60) level = 'SPEED';
    else if (score > 30) level = 'ACCURACY';

    return {
        score: Math.round(score),
        level,
        stats: {
            symbols,
            caps,
            avgWordLen: parseFloat(avgWordLen.toFixed(1)),
            density: parseFloat((symbols / text.length).toFixed(2))
        }
    };
};

const INITIAL_WIDTH = { width: 0 };

// --- SUB-COMPONENTS ---

const ComplexityDisplay = memo(({ text }: { text: string }) => {
    const analysis = useMemo(() => calculateComplexity(text), [text]);

    const animateWidth = useMemo(() => ({ width: `${analysis.score}%` }), [analysis.score]);
    const transition = useMemo(() => ({ duration: 1.5, ease: "circOut" }), []);

    return (
        <div className="glass-card bg-black/40 border-white/5 flex flex-col gap-8 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-[80px] -z-10 rounded-full group-hover:bg-neon-cyan/10 transition-colors duration-700" />

            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-white/30 tracking-[0.4em]">Neural Resistance</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-neon-cyan italic drop-shadow-[0_0_15px_rgba(0,255,242,0.3)]">{analysis.score}</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase">Index</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <span className="text-[9px] uppercase font-black text-white/30 tracking-[0.3em]">Protocol Level</span>
                    <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-lg transition-all duration-500 ${analysis.level === 'FLOW STATE' ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-neon-purple/20' :
                        analysis.level === 'SPEED' ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-orange-500/10' :
                            analysis.level === 'ACCURACY' ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-neon-cyan/20' :
                                'bg-white/5 border-white/10 text-white/40'
                        }`}>
                        {analysis.level}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 p-5 bg-white/2 rounded-3xl border border-white/5 group/link hover:border-white/10 transition-colors">
                    <span className="text-[8px] uppercase font-black text-white/20 tracking-[.25em] flex items-center gap-2">
                        <Activity size={10} className="text-white/40" />
                        Symbol Load
                    </span>
                    <span className="text-sm font-mono font-black text-white">{analysis.stats.symbols} <span className="text-[9px] opacity-40">Chars</span></span>
                </div>
                <div className="flex flex-col gap-1.5 p-5 bg-white/2 rounded-3xl border border-white/5 group/link hover:border-white/10 transition-colors">
                    <span className="text-[8px] uppercase font-black text-white/20 tracking-[.25em] flex items-center gap-2">
                        <BarChart3 size={10} className="text-white/40" />
                        Cap Density
                    </span>
                    <span className="text-sm font-mono font-black text-white">{Math.round(analysis.stats.density * 100)}%</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                    <span>Difficulty Threshold</span>
                    <span className="text-neon-cyan">{analysis.score}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                    <motion.div
                        initial={INITIAL_WIDTH}
                        animate={animateWidth}
                        transition={transition}
                        className={`h-full rounded-full transition-all duration-700 ${analysis.score > 70
                            ? 'bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_20px_rgba(188,19,254,0.5)]'
                            : 'bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_20px_rgba(0,255,242,0.4)]'
                            }`}
                    />
                </div>
            </div>

            <div className="pt-2">
                <p className="text-[9px] text-white/15 font-mono italic leading-relaxed uppercase tracking-[0.15em]">
                    // SYNCHRONIZATION_METRICS_V2.0
                </p>
            </div>
        </div>
    );
});


// --- MAIN COMPONENT ---

export const ProtocolArchitect = () => {
    const { setView } = useNavigationStore();
    const { setText } = useTypingStore();

    const [title, setTitle] = useState("New Neural Fragment");
    const [description, setDescription] = useState("Custom technical training protocol.");
    const [text, setTextContent] = useState("void main() {\n  printf(\"Hello DeepEye Operative\\n\");\n}");
    const [isPublic, setIsPublic] = useState(true);
    const [difficulty] = useState<'foundation' | 'accuracy' | 'speed' | 'flow'>('speed');
    const [loading, setLoading] = useState(false);

    const handleDiscard = useCallback(() => setView('dashboard'), [setView]);
    const handleTextContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setTextContent(e.target.value), []);
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), []);
    const setPublicTrue = useCallback(() => setIsPublic(true), []);
    const setPublicFalse = useCallback(() => setIsPublic(false), []);

    const handlePreview = useCallback(() => {
        setText(text, 'practice', 'preview_foundry');
        setView('train');
    }, [text, setText, setView]);

    const handleSave = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'protocols'), {
                title,
                description,
                text,
                isPublic,
                difficulty,
                creatorId: user.uid,
                createdAt: serverTimestamp(),
                version: 1,
                tags: [difficulty]
            });
            setView('dashboard');
        } catch (e) {
            console.error("Foundry Archive Error:", e);
        } finally {
            setLoading(false);
        }
    }, [title, description, text, isPublic, difficulty, setView]);

    return (
        <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto py-12 px-6">
            {/* Header Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-white/2 border border-white/5 p-10 rounded-[40px] shadow-2xl backdrop-blur-3xl relative shrink-0">
                {/* Glowing Top Edge */}
                <div className="absolute -top-[1px] inset-x-20 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-80" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-neon-cyan/20 blur-xl rounded-full" />

                <div className="flex flex-col gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-3 text-neon-cyan">
                        <Cpu size={20} className="animate-pulse shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic truncate">Architect Domain // Foundry 2.0</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-tight break-words">Protocol Architect</h1>
                    <p className="text-white/30 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] italic max-w-2xl">Synthesize high-fidelity neural fragments for public and fleet-wide synchronization.</p>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 shrink-0">
                    <button onClick={handleDiscard} className="px-8 py-4 rounded-2xl glass-card hover:bg-white/5 text-[10px] uppercase font-black tracking-widest text-white transition-all border-white/10 hover:border-white/20">Discard</button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-10 py-4 bg-neon-cyan text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-neon-cyan hover:bg-white transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span className="whitespace-nowrap">Register Fragment</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Editor Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="glass-card p-0 overflow-hidden border-white/5 bg-black/60 shadow-2xl rounded-[40px]">
                        <div className="px-8 py-5 bg-white/2 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Code size={18} className="text-neon-cyan" />
                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50">Neural Fragment Buffer</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <BarChart3 size={12} className="text-white/20" />
                                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{text.length} Chars Synchronized</span>
                                </div>
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={handleTextContentChange}
                            className="w-full h-[500px] bg-transparent p-10 text-xl font-mono text-white/90 outline-none resize-none selection:bg-neon-cyan/20 leading-relaxed placeholder:text-white/5"
                            placeholder="Input sync content (Code, Prose, Technical Specs)..."
                            spellCheck={false}
                        />
                    </div>

                    <button
                        onClick={handlePreview}
                        className="w-full py-6 glass-card bg-neon-cyan/5 border-neon-cyan/10 hover:bg-neon-cyan/10 hover:border-neon-cyan/30 flex items-center justify-center gap-4 transition-all group rounded-[32px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-transform">
                            <Play size={18} className="text-neon-cyan ml-1" />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white group-hover:text-neon-cyan transition-colors">Test Synchronization Drive</span>
                    </button>
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 flex flex-col gap-8">

                    <ComplexityDisplay text={text} />

                    <div className="glass-card flex flex-col gap-8 bg-white/2 border-white/10 p-10 rounded-[40px]">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] flex items-center gap-2">
                                <Activity size={12} />
                                Identifier
                            </label>
                            <input
                                value={title}
                                onChange={handleTitleChange}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-neon-cyan/50 transition-colors placeholder:text-white/5"
                                placeholder="MODULE_ID"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] flex items-center gap-2">
                                <BarChart3 size={12} />
                                Metadata Summary
                            </label>
                            <textarea
                                value={description}
                                onChange={handleDescriptionChange}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-medium text-white/60 h-24 outline-none resize-none focus:border-neon-cyan/50 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] flex items-center gap-2">
                                    <Globe size={12} />
                                    Access Protocol
                                </label>
                                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-2">
                                    <button
                                        onClick={setPublicTrue}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-3 transition-all ${isPublic ? 'bg-neon-cyan text-black shadow-neon-cyan' : 'text-white/30 hover:text-white'}`}
                                    >
                                        <Globe size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Public Grid</span>
                                    </button>
                                    <button
                                        onClick={setPublicFalse}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-3 transition-all ${!isPublic ? 'bg-neon-purple text-white shadow-neon-purple' : 'text-white/30 hover:text-white'}`}
                                    >
                                        <Lock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Fleet Only</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-neon-purple/5 border-neon-purple/20 p-8 flex flex-col gap-5 rounded-[32px]">
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-neon-purple" />
                            <span className="text-[10px] font-black uppercase text-neon-purple tracking-[0.3em]">Architect Protocol</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic">
                            High-complexity fragments automatically trigger <span className="text-neon-purple font-bold">Strict Exam</span> locks for public members to maintain neural quality standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
