import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, Cpu, Terminal, ChevronRight, Globe, Activity, Award, LucideIcon, ArrowUpRight, CheckCircle, Database, Layers } from 'lucide-react';

export const metadata = {
  title: "DeepEye.Typing | Next-Gen Neural Interface Training",
  description: "Synchronize your cognitive flow with the world's most advanced typing protocol. Built for elite operatives and developers.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white selection:bg-neon-cyan/40 overflow-x-hidden">

      {/* --- NEURAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent" />
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-neon-cyan/10 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-neon-purple/5 rounded-full blur-[200px] animate-pulse-slow" />
      </div>

      {/* --- NAVIGATION PROTOCOL --- */}
      <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-2xl border-b border-white/[0.03] px-10 h-24 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-neon-cyan font-black text-2xl drop-shadow-[0_0_8px_rgba(0,255,242,0.6)]">D</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">DeepEye.<span className="text-neon-cyan">Typing</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/30 mt-1">Foundry Protocol v3.0</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          {['Neural Grid', 'Global Standings', 'Tech Specs', 'Security Architecture'].map(item => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:text-neon-cyan transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-cyan transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white">
            Log In
          </Link>
          <Link href="/download" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-neon-cyan transition-all group">
            Initialize Sync
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10">

        {/* --- HERO SECTION: THE GATEWAY --- */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-10">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

            <div className="flex flex-col gap-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-xl">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neon-cyan italic">Protocol Stream Online // Global Node Active</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-7xl md:text-[110px] font-black italic tracking-tighter leading-[0.8] uppercase">
                  Evolve Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_30px_rgba(0,255,242,0.3)]">Cognitive Link.</span>
                </h1>
                <p className="text-xl text-white/40 max-w-xl leading-relaxed font-medium italic">
                  The world&apos;s most advanced neural interface training suite. Built for high-velocity engagement and biometric precision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                <button className="px-12 py-6 bg-neon-cyan text-black font-black uppercase tracking-[0.3em] text-xs rounded-3xl shadow-neon-cyan hover:bg-white transition-all transform hover:-translate-y-2 active:scale-95">
                  Begin Calibration
                </button>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Available On</span>
                  <span className="text-xs font-bold text-white/60">macOS, Windows, Linux & Web</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-10 pt-12 border-t border-white/[0.05]">
                <KpiStat label="Total Syncs" value="4.8M+" />
                <KpiStat label="Avg Bitrate" value="122 WPM" />
                <KpiStat label="Stability" value="99.2%" />
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-[60px] blur-[100px] opacity-20 group-hover:opacity-60 transition-opacity duration-1000" />

              <div className="relative glass-card p-4 rounded-[64px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] transform transition-all duration-1000 group-hover:rotate-x-6 group-hover:rotate-y-12">
                <div className="relative aspect-square w-full bg-[#0a0a0f] rounded-[52px] overflow-hidden border border-white/5">
                  {/* Placeholder for Hero Image - would be a high-fidelity screenshot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={120} className="text-white/5 animate-pulse" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                  </div>
                </div>
              </div>

              {/* Floaters */}
              <div className="absolute -top-12 -right-8 glass-panel p-6 rounded-[32px] border-white/10 backdrop-blur-3xl animate-float shadow-2xl">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-neon-cyan">
                    <Activity size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Live Bitrate</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic tracking-tighter">168</span>
                    <span className="text-[10px] font-black uppercase text-white/20">WPM</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-12 glass-panel p-6 rounded-[32px] border-white/10 backdrop-blur-3xl animate-float-delayed shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center shadow-neon-purple/20 shadow-lg">
                    <Shield size={20} className="text-neon-purple" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Clearance</span>
                    <span className="text-sm font-black italic uppercase tracking-tighter">Elite Overseer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- DYNAMIC TELEMETRY SECTION --- */}
        <section className="py-24 px-10 border-y border-white/[0.03] bg-white/[0.01]">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-12">
            <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Database size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Firebase Realtime</span>
            </div>
            <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Layers size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Tauri Native</span>
            </div>
            <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Globe size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Global CDN</span>
            </div>
            <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Cpu size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Aura Engine 2.0</span>
            </div>
            <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Award size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Certified 2026</span>
            </div>
          </div>
        </section>

        {/* --- CORE ARCHITECTURE: STACK --- */}
        <section id="neural-grid" className="py-40 px-10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

              <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="flex items-center gap-4 text-neon-cyan">
                  <div className="h-px w-12 bg-neon-cyan" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">System Architecture</span>
                </div>
                <h2 className="text-6xl font-black italic tracking-tighter leading-none uppercase">Advanced <br /> <span className="text-neon-cyan">Neural Layers.</span></h2>
                <p className="text-xl text-white/30 leading-relaxed font-medium">
                  Our performance stack is built on three pillars of high-frequency engagement, ensuring zero-latency cognitive synchronization.
                </p>
                <div className="flex flex-col gap-6 mt-4">
                  <FeatureItem title="Biometric Telemetry" desc="Real-time tracking of dwell time, flight paths, and temporal clustering." />
                  <FeatureItem title="Haptic Audio Synthesis" desc="Procedural soundscapes that evolve based on your burst velocity." />
                  <FeatureItem title="Collaborative Fleets" desc="Multiplayer synchronization protocols with 250ms burst-syncing." />
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard
                  icon={Activity}
                  title="AI Diagnostics"
                  desc="Neural analysis identifies specific character clusters where your rhythm breaks, providing targeted corrective protocols."
                />
                <FeatureCard
                  icon={Shield}
                  title="Strict Exams"
                  desc="Alpha-grade training protocols where a single micro-collision results in complete signal termination."
                />
                <FeatureCard
                  icon={Globe}
                  title="Registry Honors"
                  desc="Gain XP, evolve your operative clearance, and unlock cryptographic badges as you dominate the grid."
                />
                <FeatureCard
                  icon={Terminal}
                  title="Syntax Forge"
                  desc="Build and share custom technical fragments using the Protocol Architect for specialized team training."
                />
              </div>

            </div>
          </div>
        </section>

        {/* --- MISSION CALL: SYNC --- */}
        <section className="py-60 px-10 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[160px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="glass-card bg-black/40 border border-white/5 p-20 rounded-[80px] text-center shadow-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-40" />

              <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none mb-10 uppercase">
                Initialize <br /> <span className="text-neon-cyan">The Uplink.</span>
              </h2>
              <p className="text-xl text-white/30 max-w-2xl mx-auto mb-16 font-medium italic">
                Stop typing. Start synchronizing. Join the elite tier of digital operatives across the global neural grid.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="w-full sm:w-auto px-16 py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-3xl hover:bg-neon-cyan transition-all transform hover:scale-105 shadow-2xl">
                  Get For MacOS
                </button>
                <button className="w-full sm:w-auto px-16 py-8 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-xs rounded-3xl hover:bg-white/10 transition-all backdrop-blur-3xl">
                  Launch Web Terminal
                </button>
              </div>

              <div className="mt-20 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle size={14} className="text-neon-cyan" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Verified Secure Build // Open Protocol 3.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-24 px-10 border-t border-white/[0.03] bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-neon-cyan font-black text-xl">D</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter">DeepEye</span>
            </div>
            <p className="text-sm font-medium text-white/20 leading-relaxed italic">
              The next-generation typing suite built for the future of human-machine interface. Master your speed. Conquer the grid.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
            <FooterGroup title="Grid" links={['Neural Deck', 'Global Standings', 'Protocols', 'Fleets']} />
            <FooterGroup title="Operative" links={['Download', 'Release Notes', 'Architecture', 'Security']} />
            <FooterGroup title="Identity" links={['Neural Sync', 'Registry', 'Honor Board', 'Privacy']} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/10">© 2026 DeepEye Systems // Neural Foundry Division</span>
          <div className="flex gap-10">
            <Link href="#" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>

      {/* --- CURSOR LIGHTING --- */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(0,255,242,0.05)_0%,transparent_50%)]" />
    </div>
  );
}

function KpiStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 leading-none">{label}</span>
      <span className="text-3xl font-black text-white italic tracking-tighter">{value}</span>
    </div>
  )
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 shadow-neon-cyan group-hover:scale-150 transition-transform" />
      <div className="flex flex-col">
        <span className="text-sm font-black text-white uppercase tracking-tight">{title}</span>
        <span className="text-xs text-white/30 font-medium italic">{desc}</span>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="glass-card flex flex-col gap-8 group hover:bg-white/[0.03] p-10 rounded-[48px] border-white/5 transition-all h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30 transition-all shadow-2xl">
        <Icon size={32} className="text-white/20 group-hover:text-neon-cyan transition-all transform group-hover:scale-110" />
      </div>
      <div>
        <h3 className="text-2xl font-black mb-4 italic uppercase tracking-tight text-white group-hover:text-neon-cyan transition-colors">{title}</h3>
        <p className="text-[13px] text-white/30 leading-relaxed font-medium italic">{desc}</p>
      </div>
    </div>
  )
}

function FooterGroup({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{title}</span>
      <div className="flex flex-col gap-4">
        {links.map(link => (
          <Link key={link} href="#" className="text-xs font-bold text-white/40 hover:text-neon-cyan transition-colors">{link}</Link>
        ))}
      </div>
    </div>
  )
}
