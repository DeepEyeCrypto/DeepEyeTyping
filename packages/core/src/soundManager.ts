export class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() { }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public setMuted(mute: boolean) {
        this.isMuted = mute;
    }

    public playKeypress() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Transient Click (High freq)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(1200, now);
        clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.01);
        clickGain.gain.setValueAtTime(0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        clickOsc.connect(clickGain).connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.01);

        // 2. Body Thud (Mid-Low freq)
        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(200, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
        bodyGain.gain.setValueAtTime(0.05, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        bodyOsc.connect(bodyGain).connect(this.ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.05);
    }

    public playError() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Harsh Sawtooth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // 2. Noise Burst for "Crunch"
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        const noiseGain = this.ctx.createGain();
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        noise.connect(noiseGain).connect(this.ctx.destination);
        noise.start(now);
    }

    public playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Ethereal Sine Arpeggio (Major 7th)
        [523.25, 659.25, 783.99, 987.77].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const t = now + i * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.5);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.05, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

            osc.connect(gain).connect(this.ctx!.destination);
            osc.start(t);
            osc.stop(t + 0.6);
        });
    }

    public playNavigation() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain).connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }
}

export const soundManager = new SoundManager();
