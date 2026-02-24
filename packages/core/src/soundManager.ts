export class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private masterGain: GainNode | null = null;
    private lastInitAttempt: number = 0;

    constructor() { }

    private init() {
        if (typeof window === 'undefined') return;
        if (this.ctx && this.ctx.state !== 'closed') {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            return;
        }

        // Rate limit init attempts to prevent browser overhead
        const now = Date.now();
        if (now - this.lastInitAttempt < 1000) return;
        this.lastInitAttempt = now;

        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;

            this.ctx = new AudioCtx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.updateMuted();
        } catch (e) {
            console.error("Neural Sound Initialization Failed:", e);
        }
    }

    private updateMuted() {
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx?.currentTime || 0);
        }
    }

    public setMuted(mute: boolean) {
        this.isMuted = mute;
        this.updateMuted();
    }

    /**
     * Procedural Keypress Synthesis
     * @param velocity Optional multiplier for pitch based on typing speed
     */
    public playKeypress(velocity: number = 1) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const now = this.ctx.currentTime;
        const pitchShift = Math.min(1.2, 0.9 + (velocity - 1) * 0.1);

        // 1. Transient Click (Metallic/Mechanical)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(1200 * pitchShift, now);
        clickOsc.frequency.exponentialRampToValueAtTime(400 * pitchShift, now + 0.01);
        clickGain.gain.setValueAtTime(0.06, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        clickOsc.connect(clickGain).connect(this.masterGain);
        clickOsc.start(now);
        clickOsc.stop(now + 0.01);

        // 2. Body Thud (Tactile feedback)
        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(180 * pitchShift, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(100 * pitchShift, now + 0.04);
        bodyGain.gain.setValueAtTime(0.04, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        bodyOsc.connect(bodyGain).connect(this.masterGain);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.04);
    }

    public playError() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const now = this.ctx.currentTime;

        // Harsh Low Frequency Pulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.2);

        // White Noise Friction
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        const noiseGain = this.ctx.createGain();
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.04, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        noise.connect(noiseGain).connect(this.masterGain);
        noise.start(now);
    }

    public playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const now = this.ctx.currentTime;

        // Neural Uplink Chime (Pentatonic Ascent)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const t = now + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 0.4);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

            osc.connect(gain).connect(this.masterGain!);
            osc.start(t);
            osc.stop(t + 0.5);
        });
    }

    public playNavigation() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.15);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
    }
}

export const soundManager = new SoundManager();
