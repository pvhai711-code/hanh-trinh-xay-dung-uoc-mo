/**
 * Background Audio Manager with support for 'uocmo.mp3' and seamless fallback synthesizer.
 * - Loop playback
 * - Volume control (0.0 to 1.0)
 * - Safe from SSR/re-render issues
 * - Starts paused per browser autoplay security policies
 */

class BackgroundAudioManager {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private audioSrc: string = '/uocmo.mp3';

  // Fallback Web Audio synthesizer if mp3 is blocked or unavailable
  private synthCtx: AudioContext | null = null;
  private synthTimerId: number | null = null;
  private synthMasterGain: GainNode | null = null;
  private useSynthFallback: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio(this.audioSrc);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = this.volume;

        audio.addEventListener('error', (e) => {
          console.warn('Audio element error, falling back to ambient synthesizer', e);
          this.useSynthFallback = true;
        });

        this.audioElement = audio;
      } catch (err) {
        console.warn('Could not initialize Audio element:', err);
        this.useSynthFallback = true;
      }
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    if (this.synthMasterGain && this.synthCtx) {
      this.synthMasterGain.gain.setValueAtTime(clamped * 0.2, this.synthCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.isPlaying = true;

    if (this.audioElement && !this.useSynthFallback) {
      this.audioElement.volume = this.volume;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play failed, activating Web Audio fallback:', err);
          this.useSynthFallback = true;
          this.startSynth();
        });
      }
    } else {
      this.startSynth();
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch (_) {}
    }
    this.stopSynth();
  }

  public stop() {
    this.pause();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // --- Web Audio Fallback Synthesizer ---
  private initSynth() {
    if (!this.synthCtx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.synthCtx = new AudioContextClass();
      }
    }
    if (this.synthCtx && this.synthCtx.state === 'suspended') {
      this.synthCtx.resume();
    }
  }

  private startSynth() {
    this.initSynth();
    if (!this.synthCtx) return;

    this.synthMasterGain = this.synthCtx.createGain();
    this.synthMasterGain.gain.setValueAtTime(0.001, this.synthCtx.currentTime);
    this.synthMasterGain.gain.linearRampToValueAtTime(
      this.volume * 0.15,
      this.synthCtx.currentTime + 1.5
    );
    this.synthMasterGain.connect(this.synthCtx.destination);

    const scale = [174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

    const droneOsc = this.synthCtx.createOscillator();
    const droneGain = this.synthCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(174.61, this.synthCtx.currentTime);
    droneGain.gain.setValueAtTime(0.03, this.synthCtx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(this.synthMasterGain);
    droneOsc.start();

    let step = 0;
    const playChime = () => {
      if (!this.isPlaying || !this.synthCtx || !this.synthMasterGain) return;

      const freq = scale[step % scale.length];
      step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.synthCtx.createOscillator();
      const noteGain = this.synthCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.synthCtx.currentTime);

      const now = this.synthCtx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.035, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(noteGain);
      noteGain.connect(this.synthMasterGain);

      osc.start(now);
      osc.stop(now + 3.6);

      const nextDelay = 1800 + Math.random() * 1200;
      this.synthTimerId = window.setTimeout(playChime, nextDelay);
    };

    playChime();
  }

  private stopSynth() {
    if (this.synthTimerId) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
    if (this.synthMasterGain && this.synthCtx) {
      const now = this.synthCtx.currentTime;
      this.synthMasterGain.gain.setValueAtTime(this.synthMasterGain.gain.value, now);
      this.synthMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }
  }
}

export const ambientAudio = new BackgroundAudioManager();
