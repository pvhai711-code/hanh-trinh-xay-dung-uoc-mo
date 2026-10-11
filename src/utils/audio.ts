/**
 * Soothing ambient background music synthesizer using Web Audio API.
 * Ensures zero external file loading, 100% offline reliability, and pleasant calming atmosphere.
 */

class AmbientAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Master volume control with gentle fade in
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);
    this.masterGain.connect(this.ctx.destination);

    // Warm peaceful pentatonic scale frequencies (F Major pentatonic: F, G, A, C, D)
    const scale = [174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

    // Background soft pad drone
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(174.61, this.ctx.currentTime); // F3
    droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start();

    // Loop gentle ambient chime arpeggio
    let step = 0;
    const playChime = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const freq = scale[step % scale.length];
      step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.035, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.6);

      const nextDelay = 1800 + Math.random() * 1200;
      this.timerId = window.setTimeout(playChime, nextDelay);
    };

    playChime();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioPlayer();
