export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat relative overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-deep-bg z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center gap-12">

        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glass-100 border border-glass-200">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-sm font-medium text-neon-cyan tracking-wider">PROTOCOL V1.0 - ONLINE</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            DEEP<span className="text-neon-cyan neon-text">EYE</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl font-light leading-relaxed">
            The advanced neural interface training protocol.
            Enhance your typing bandwidth with our liquid-glass powered engine.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in delay-200 duration-700">
          {[
            { title: "Neural Sync", desc: "Real-time WPM/Accuracy tracking with local persistence." },
            { title: "Liquid UI", desc: "Next-gen glassmorphism interface with 60fps animations." },
            { title: "Cloud Grid", desc: "Secure Firebase synchronization for cross-device training." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 flex flex-col items-start text-left hover:border-neon-cyan/50 group">
              <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors mb-2">{item.title}</h3>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-4 animate-in fade-in delay-300 duration-700">
          <a
            href="#"
            className="px-8 py-4 rounded-xl bg-neon-cyan text-black font-bold text-lg hover:scale-105 hover:bg-white transition-all shadow-neon-cyan"
          >
            Initialize Desktop Protocol
          </a>
          <a
            href="#"
            className="px-8 py-4 rounded-xl bg-glass-100 border border-glass-200 text-white font-bold text-lg hover:bg-glass-200 transition-all backdrop-blur-md"
          >
            View Documentation
          </a>
        </div>

      </main>

      <footer className="absolute bottom-8 text-white/30 text-xs font-mono">
        SYSTEM_ID: DEEPEYE-WEB-001 // SECURE_CONNECTION
      </footer>
    </div>
  );
}
