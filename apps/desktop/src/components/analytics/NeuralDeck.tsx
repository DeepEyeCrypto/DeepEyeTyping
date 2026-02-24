import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { BiometricCloud } from './BiometricCloud';
import { useTypingStore } from 'core';
import { motion } from 'framer-motion';
import { Activity, Target, Cpu } from 'lucide-react';

// Polyfill for WKWebView/VM environments where getShaderPrecisionFormat might return null
if (typeof HTMLCanvasElement !== 'undefined') {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HTMLCanvasElement.prototype as any).getContext = function (type: string, attribs: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctx: any = originalGetContext.apply(this, [type, attribs] as any);
        if (ctx && (type === 'webgl' || type === 'webgl2')) {
            const origGet = ctx.getShaderPrecisionFormat;
            if (origGet) {
                ctx.getShaderPrecisionFormat = function (shaderType: number, precisionType: number) {
                    const result = origGet.apply(this, [shaderType, precisionType]);
                    return result || { rangeMin: 127, rangeMax: 127, precision: 23 }; // Mock highp if null
                };
            }
        }
        return ctx;
    };
}

const DPR = [1, 2] as const;
const CAM_POS = [0, 10, 30] as const;
const LIGHT_POS_1 = [10, 10, 10] as const;
const LIGHT_POS_2 = [-10, -10, -10] as const;
const GRID_ARGS = [100, 50, '#111', '#050505'] as const;
const GRID_POS = [0, -10, 0] as const;
const OVERLAY_INIT = { opacity: 0 };
const OVERLAY_ANIM = { opacity: [0, 1, 1, 0] };
const OVERLAY_TRANS = { duration: 4, times: [0, 0.1, 0.9, 1] };

export const NeuralDeck = () => {
    const { consistency, keystrokes } = useTypingStore();

    return (
        <div className="relative w-full h-[calc(100vh-160px)] bg-black/60 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
            {/* 3D Visualizer Context */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={DPR}>
                    <PerspectiveCamera makeDefault position={CAM_POS} fov={50} />
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxDistance={60}
                        minDistance={5}
                    />

                    <ambientLight intensity={0.5} />
                    <pointLight position={LIGHT_POS_1} intensity={1} color="#00fff2" />
                    <pointLight position={LIGHT_POS_2} intensity={0.5} color="#bc13fe" />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <Suspense fallback={null}>
                        <BiometricCloud />
                    </Suspense>

                    {/* Floor Grid */}
                    <gridHelper args={GRID_ARGS} position={GRID_POS} />
                </Canvas>
            </div>

            {/* Floating HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                {/* Header HUD */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,242,0.4)]">
                            <Cpu size={20} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Biometric Signature Hub</span>
                        </div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">The Neural Deck</h1>
                        <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] italic">Keystroke Spatial Mapping // Active Decryption</p>
                    </div>

                    <div className="glass-panel px-6 py-4 rounded-3xl border-white/10 flex flex-col items-end gap-1">
                        <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Active Stream</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-neon-cyan" />
                            <span className="text-xs font-mono text-neon-cyan font-bold uppercase tracking-widest">Live Feed Linked</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="flex justify-between items-end">
                    <div className="flex gap-4">
                        <div className="glass-panel p-6 rounded-[32px] border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col gap-1 min-w-[120px]">
                            <div className="flex items-center gap-2 text-neon-cyan mb-1">
                                <Activity size={14} />
                                <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Density</span>
                            </div>
                            <span className="text-3xl font-black text-white italic">{keystrokes.length}</span>
                            <span className="text-[9px] uppercase font-bold text-white/20 tracking-tighter">Verified Points</span>
                        </div>

                        <div className="glass-panel p-6 rounded-[32px] border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col gap-1 min-w-[120px]">
                            <div className="flex items-center gap-2 text-neon-purple mb-1">
                                <Target size={14} />
                                <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Clustering</span>
                            </div>
                            <span className="text-3xl font-black text-white italic">{Math.round((1 - consistency) * 100)}%</span>
                            <span className="text-[9px] uppercase font-bold text-white/20 tracking-tighter">Consistency Factor</span>
                        </div>
                    </div>

                    {/* Legend HUD */}
                    <div className="glass-panel p-6 rounded-[32px] border-white/10 bg-black/80 flex flex-col gap-4">
                        <span className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Axis Mapping Protocol</span>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-neon-cyan" />
                                <span className="text-[10px] text-white/60 font-mono uppercase tracking-widest">X: Dwell Time Buffer</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-neon-purple" />
                                <span className="text-[10px] text-white/60 font-mono uppercase tracking-widest">Y: Flight Transition</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="text-[10px] text-white/60 font-mono uppercase tracking-widest">Z: Temporal Sequence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instruction Overlay */}
            <motion.div
                initial={OVERLAY_INIT}
                animate={OVERLAY_ANIM}
                transition={OVERLAY_TRANS}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
                <div className="glass-panel px-8 py-4 rounded-full border-white/20 text-xs font-black uppercase tracking-[0.5em] italic">
                    Use Mouse to Orbit // Scroll to Probe Depth
                </div>
            </motion.div>
        </div>
    );
};
