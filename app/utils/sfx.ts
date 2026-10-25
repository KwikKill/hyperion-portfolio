// Synthesized sound for the self-destruct sequences, without any audio file, and one master gain
// for the mute. Browser-only: the audio context starts from a click, as browsers require.

export interface ToneOptions {
  type?: OscillatorType;
  f?: number;
  // Frequency reached at the end of the tone
  f1?: number;
  dur?: number;
  gain?: number;
  attack?: number;
  pan?: number;
  delay?: number;
}

export interface NoiseOptions {
  type?: BiquadFilterType;
  f?: number;
  f1?: number;
  q?: number;
  dur?: number;
  gain?: number;
  attack?: number;
  pan?: number;
  // Brown noise (deep rumble) instead of white noise
  brown?: boolean;
  delay?: number;
}

export interface DroneOptions {
  // Oscillators at these frequencies instead of noise
  freqs?: number[];
  type?: OscillatorType;
  brown?: boolean;
  filter?: BiquadFilterType;
  f?: number;
  q?: number;
}

// A sustained sound (noise or oscillators) whose level, pitch and filter move over time
export interface Drone {
  gain: (value: number, time?: number) => void;
  // Multiplies the starting frequencies of the oscillators
  freq: (multiplier: number, time?: number) => void;
  filter: (value: number, time?: number) => void;
  stop: (fade?: number) => void;
}

const LEVEL = 0.6;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let whiteNoise: AudioBuffer | null = null;
let brownNoise: AudioBuffer | null = null;
let muted = false;

function audio(): AudioContext | null {
  if (!context) {
    const Context = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return null;
    context = new Context();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 6;
    compressor.connect(context.destination);
    master = context.createGain();
    master.gain.value = muted ? 0 : LEVEL;
    master.connect(compressor);
    // Two seconds of noise, looped by every sound that needs some
    const length = context.sampleRate * 2;
    whiteNoise = context.createBuffer(1, length, context.sampleRate);
    brownNoise = context.createBuffer(1, length, context.sampleRate);
    const white = whiteNoise.getChannelData(0);
    const brown = brownNoise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const value = Math.random() * 2 - 1;
      white[i] = value;
      last = (last + 0.02 * value) / 1.02;
      brown[i] = last * 3.5;
    }
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (context && master) master.gain.setTargetAtTime(value ? 0 : LEVEL, context.currentTime, 0.03);
}

// The sounds of one sequence, on a shared output so they can all be faded out at once
export function createSfx() {
  const ctx = audio();
  const bus = ctx && master ? ctx.createGain() : null;
  if (bus && master) bus.connect(master);
  const drones: Drone[] = [];
  const silent: Drone = {
    gain() {}, freq() {}, filter() {}, stop() {},
  };

  function output(node: AudioNode, pan: number) {
    if (!ctx || !bus) return;
    if (pan && ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      node.connect(panner);
      panner.connect(bus);
    } else {
      node.connect(bus);
    }
  }

  function envelope(amp: GainNode, t0: number, peak: number, attack: number, duration: number) {
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(duration, attack + 0.01));
  }

  function tone({
    type = 'sine', f = 440, f1, dur = 0.2, gain = 0.15, attack = 0.005, pan = 0, delay = 0,
  }: ToneOptions = {}) {
    if (!ctx || !bus) return;
    const t0 = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(f, t0);
    if (f1) oscillator.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + dur);
    const amp = ctx.createGain();
    envelope(amp, t0, gain, attack, dur);
    oscillator.connect(amp);
    output(amp, pan);
    oscillator.start(t0);
    oscillator.stop(t0 + dur + 0.05);
  }

  function noise({
    type = 'lowpass', f = 1200, f1, q = 0.7, dur = 0.3, gain = 0.15, attack = 0.005, pan = 0, brown = false, delay = 0,
  }: NoiseOptions = {}) {
    const buffer = brown ? brownNoise : whiteNoise;
    if (!ctx || !bus || !buffer) return;
    const t0 = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(f, t0);
    filter.Q.value = q;
    if (f1) filter.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const amp = ctx.createGain();
    envelope(amp, t0, gain, attack, dur);
    source.connect(filter);
    filter.connect(amp);
    output(amp, pan);
    source.start(t0, Math.random());
    source.stop(t0 + dur + 0.08);
  }

  function drone({
    freqs, type = 'sine', brown = false, filter = 'lowpass', f = 800, q = 0.7,
  }: DroneOptions = {}): Drone {
    const buffer = brown ? brownNoise : whiteNoise;
    if (!ctx || !bus || !buffer) return silent;
    const amp = ctx.createGain();
    amp.gain.value = 0.0001;
    amp.connect(bus);
    const band = ctx.createBiquadFilter();
    band.type = filter;
    band.frequency.value = f;
    band.Q.value = q;
    band.connect(amp);
    const oscillators = (freqs ?? []).map((frequency) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.connect(band);
      oscillator.start();
      return oscillator;
    });
    let source: AudioBufferSourceNode | null = null;
    if (!freqs) {
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(band);
      source.start();
    }
    const sources: AudioScheduledSourceNode[] = source ? [source] : oscillators;
    let stopped = false;
    const constant = (time: number) => Math.max(time, 0.01) / 3;
    const handle: Drone = {
      gain(value, time = 0.5) {
        if (!stopped) amp.gain.setTargetAtTime(Math.max(value, 0.0001), ctx.currentTime, constant(time));
      },
      freq(multiplier, time = 0.5) {
        if (stopped) return;
        oscillators.forEach((oscillator, i) => oscillator.frequency.setTargetAtTime((freqs?.[i] ?? 0) * multiplier, ctx.currentTime, constant(time)));
      },
      filter(value, time = 0.5) {
        if (!stopped) band.frequency.setTargetAtTime(value, ctx.currentTime, constant(time));
      },
      stop(fade = 0.2) {
        if (stopped) return;
        stopped = true;
        amp.gain.setTargetAtTime(0.0001, ctx.currentTime, fade / 3);
        sources.forEach((node) => node.stop(ctx.currentTime + fade * 2 + 0.1));
      },
    };
    drones.push(handle);
    return handle;
  }

  function close() {
    drones.forEach((handle) => handle.stop());
    if (!ctx || !bus) return;
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
    setTimeout(() => bus.disconnect(), 400);
  }

  return {
    tone, noise, drone, close,
  };
}

export type Sfx = ReturnType<typeof createSfx>;
