// Clock of a self-destruct sequence: seconds since the start, work scheduled at given times and
// work done on every frame. Browser-only.

type Ticker = (t: number, dt: number) => void;

export interface SequenceClock {
  readonly t: number;
  at: (time: number, fn: () => void) => void;
  after: (delay: number, fn: () => void) => void;
  // Runs on every frame until the returned function is called
  tick: (fn: Ticker) => () => void;
  // Calls fn with a progress from 0 to 1 between start and start + duration
  tween: (start: number, duration: number, fn: (progress: number) => void) => void;
  stop: () => void;
}

function safely(fn: () => void) {
  try {
    fn();
  } catch (error) {
    // One broken step must not stop the rest of the sequence
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function startClock(): SequenceClock {
  const events: { time: number; fn: () => void }[] = [];
  const tickers: Ticker[] = [];
  let t = 0;
  let last = performance.now();
  let frame = 0;
  let stopped = false;

  function loop(now: number) {
    if (stopped) return;
    // A long pause (hidden tab) does not make the sequence jump ahead; a slow machine (10 frames
    // per second and more) keeps to the real time
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    t += dt;
    for (let next = events[0]; next && next.time <= t && !stopped; next = events[0]) {
      events.shift();
      safely(next.fn);
    }
    for (const fn of tickers.slice()) {
      if (stopped) break;
      safely(() => fn(t, dt));
    }
    if (!stopped) frame = requestAnimationFrame(loop);
  }
  frame = requestAnimationFrame(loop);

  const clock: SequenceClock = {
    get t() {
      return t;
    },
    at(time, fn) {
      events.push({ time, fn });
      events.sort((a, b) => a.time - b.time);
    },
    after(delay, fn) {
      clock.at(t + delay, fn);
    },
    tick(fn) {
      tickers.push(fn);
      return () => {
        const index = tickers.indexOf(fn);
        if (index >= 0) tickers.splice(index, 1);
      };
    },
    tween(start, duration, fn) {
      const untick = clock.tick((now) => {
        if (now < start) return;
        const progress = Math.min(1, (now - start) / duration);
        fn(progress);
        if (progress >= 1) untick();
      });
    },
    stop() {
      stopped = true;
      cancelAnimationFrame(frame);
      events.length = 0;
      tickers.length = 0;
    },
  };
  return clock;
}
