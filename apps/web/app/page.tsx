import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, Cpu, Terminal, ChevronRight, Globe, Activity, Award, LucideIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white selection:bg-neon-cyan/30">
      {/* Navigation Protocol */}
      <nav className="fixed top-0 w-full z-50 bg-black/5 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center shadow-neon-cyan">
            <span className="text-neon-cyan font-black text-xl">D</span>
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">DeepEye.<span className="text-neon-cyan">Typing</span></span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Neural Grid</Link>
          <Link href="#leaderboard" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Global Standings</Link>
          <Link href="#specs" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Tech Specs</Link>
        </div>

        <Link href="/download" className="btn-primary flex items-center gap-2 group">
          Initialize Protocol
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero Section: The Neural Gateway */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-8 overflow-hidden">
          {/* Immersive Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Stream Online: v2.0.4 Live</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9]">
                MASTER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-2xl">NEURAL LINK.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed font-medium">
                DeepEye is a next-generation neural interface training protocol.
                Synchronize your cognitive flow with sub-millisecond precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <button className="px-10 py-5 bg-neon-cyan text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-neon-cyan hover:bg-white transition-all transform hover:-translate-y-1">
                  Start Training Now
                </button>
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl">
                  View Global Grid
                </button>
              </div>

              <div className="flex items-center gap-8 mt-4 pt-8 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">1.2M+</span>
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Words Processed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">98.4%</span>
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Accuracy Baseline</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">Latency</span>
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest"><span className="text-neon-cyan">Sub-5ms</span> Sync</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative glass-card p-2 rounded-[42px] border-white/10 shadow-2xl transform hover:rotate-2 transition-transform duration-700">
                <Image
                  src="/hero.png"
                  alt="DeepEye Interface"
                  width={800}
                  height={800}
                  className="rounded-[40px] shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Floating UI Badges */}
              <div className="absolute -top-10 -right-10 glass-panel p-4 rounded-3xl animate-float">
                <div className="flex flex-col items-center gap-1">
                  <Zap size={20} className="text-neon-cyan" />
                  <span className="text-lg font-black italic">142 WPM</span>
                  <span className="text-[8px] uppercase font-bold text-white/40">Peak Velocity</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 glass-panel p-4 rounded-3xl animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/40">
                    <Shield size={18} className="text-neon-purple" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/40">Certification</span>
                    <span className="text-xs font-bold">Elite Alpha Class</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid: The Core Architecture */}
        <section id="features" className="py-32 px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4 mb-20">
              <span className="text-xs uppercase font-black tracking-[0.4em] text-neon-cyan">Performance Layer</span>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter">THE NEURAL STACK.</h2>
              <div className="h-1 w-24 bg-neon-cyan rounded-full mt-4 shadow-neon-cyan" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Cpu}
                title="Haptic Engines"
                desc="Real-time procedural audio synthesis that reacts to your keystrokes, creating a physical sense of speed."
              />
              <FeatureCard
                icon={Terminal}
                title="Developer Drills"
                desc="Master high-frequency syntax in JS, Rust, Python, and C++ with strict certification protocols."
              />
              <FeatureCard
                icon={Globe}
                title="Global Grid"
                desc="Compete in real-time on the global leaderboard. Track your standing against the world's fastest operatives."
              />
              <FeatureCard
                icon={Activity}
                title="AI Diagnosis"
                desc="DeepEye analyzes your rhythm and speed traps, identifying which specific finger clusters are leaking performance."
              />
              <FeatureCard
                icon={Shield}
                title="Sudden Death"
                desc="Exam mode protocols. One mistake means mission failure. Only the most precise survive the Alpha test."
              />
              <FeatureCard
                icon={Award}
                title="Visual Progress"
                desc="Gain XP, unlock holographic badges, and evolve your operative clearance as you master the interface."
              />
            </div>
          </div>
        </section>

        {/* Call to Action: Initialize Sync */}
        <section className="py-40 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto glass-card p-16 rounded-[48px] border-white/10 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic">READY TO SYNC?</h2>
            <p className="text-white/40 mb-12 max-w-xl mx-auto">
              Join the elite tier of digital operatives.
              Download the desktop client and begin your neural calibration today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-neon-cyan transition-all transform hover:scale-105 active:scale-95">
                Download for MacOS
              </button>
              <button className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-white/10 transition-all backdrop-blur-md">
                View Documentation
              </button>
            </div>
            <p className="mt-8 text-[10px] uppercase font-bold text-white/20 tracking-[0.2em]">Alpha Build 2.0.4 • 64MB • End-to-End Encryption</p>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center">
              <span className="text-neon-cyan font-black text-xs">D</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">© 2026 DeepEye.Systems</span>
          </div>

          <div className="flex gap-10">
            <Link href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-white transition-colors">Terms of Engagement</Link>
            <Link href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-white transition-colors">Security Architecture</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="glass-card flex flex-col gap-6 group hover:translate-y--2">
      <div className="w-14 h-14 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30 transition-all shadow-xl">
        <Icon size={28} className="text-white/40 group-hover:text-neon-cyan transition-colors" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 italic">{title}</h3>
        <p className="text-sm text-white/30 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}
