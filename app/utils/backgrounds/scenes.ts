// The animated section backgrounds. init() sets up a scene for the canvas size, frame() draws one
// image; both get the stage (core.ts): context, size, theme colours, clock, pointer and focus.
import {
  makeBoard, drawBoard, drawNets, drawPad, pathSlice, pcbProbe, pcbPulses, type Board, type Net,
} from './board';
import {
  clamp, DEG, glitchSlices, gridPath, makeLayer, mix, MONO, pick, polyline, rand, rgba, scanlines, smooth, TAU, tr,
  type Point, type Scene,
} from './core';
import { CITIES, isLand, unit } from './globe';

// Home · Wireframe relief: the hero grid lifted into a terrain that scrolls towards the viewer,
// swept by a beam; survey points cling to the peaks and the far relief fades into the horizon haze.
const gridTerrain: Scene = {
  init() {
    return { scroll: 0, beam: 16, beamWait: 0, marks: [], nextMark: 1 };
  },
  frame(s, dt) {
    const { ctx, w, h, c, st } = s;
    ctx.fillStyle = rgba(c.b);
    ctx.fillRect(0, 0, w, h);
    const hor = h * 0.32;
    const vpx = w * s.focus.fx;
    const f = h * 0.85;
    const CAM = 1.35;
    const CELL = 0.55;
    const ZN = 0.65;
    const ZF = 18;
    const XS = Math.ceil(((Math.max(vpx, w - vpx) / f) * ZF) / CELL) + 1;
    st.scroll += dt * 0.75;
    const height = (x: number, zw: number) => {
      const valley = smooth(Math.min(1, Math.abs(x) / 5.5));
      const n = Math.sin(x * 0.9 + zw * 0.6) * 0.5 + Math.sin(x * 0.37 - zw * 0.9 + 1.3) * 0.7
        + Math.sin((x + zw) * 1.7) * 0.18 + Math.sin(x * 2.3 - zw * 1.9) * 0.08;
      return (0.1 + valley * 1.5) * (n + 1.46) * 0.55;
    };
    const P = (x: number, z: number, y: number): Point => [vpx + (x / z) * f, hor + ((CAM - y) / z) * f];
    // Sky and haze: the horizon glow goes down to the far terrain, which is filled with the same
    // tint (no black band at the back)
    const haze = c.light ? 0.04 : 0.07;
    const glow = ctx.createLinearGradient(0, hor - 110, 0, hor + 40);
    glow.addColorStop(0, rgba(c.s, 0));
    glow.addColorStop(0.73, rgba(c.s, c.light ? 0.12 : 0.17));
    glow.addColorStop(1, rgba(c.s, haze));
    ctx.fillStyle = glow;
    ctx.fillRect(0, hor - 110, w, 150);
    ctx.fillStyle = rgba(c.s, haze);
    ctx.fillRect(0, hor + 40, w, h * 0.12);
    ctx.strokeStyle = rgba(c.s, 0.3);
    ctx.beginPath(); ctx.moveTo(0, hor + 0.5); ctx.lineTo(w, hor + 0.5); ctx.stroke();
    // Beam: sweeps the terrain from the horizon towards the viewer, then waits
    if (st.beamWait > 0) st.beamWait -= dt;
    else {
      st.beam -= dt * 5;
      if (st.beam < ZN) { st.beam = ZF; st.beamWait = rand(1.2, 2.5); }
    }
    // Rows from the farthest to the nearest: each one hides what lies behind it
    const m0 = Math.ceil((st.scroll + ZN) / CELL);
    const m1 = Math.floor((st.scroll + ZF) / CELL);
    let prev: Point[] | null = null;
    ctx.lineJoin = 'round';
    for (let m = m1; m >= m0; m -= 1) {
      const zw = m * CELL;
      const z = zw - st.scroll;
      const pts: Point[] = [];
      for (let i = -XS; i <= XS; i += 1) pts.push(P(i * CELL, z, height(i * CELL, zw)));
      ctx.fillStyle = rgba(mix(c.b, c.s, haze * Math.pow(z / ZF, 1.5)));
      ctx.beginPath();
      ctx.moveTo(pts[0][0], h + 2);
      pts.forEach(([px, py]) => ctx.lineTo(px, py));
      ctx.lineTo(pts[pts.length - 1][0], h + 2);
      ctx.closePath();
      ctx.fill();
      const fade = Math.pow(1 - z / ZF, 1.2);
      const beamK = st.beamWait > 0 ? 0 : Math.max(0, 1 - Math.abs(z - st.beam) / 0.7);
      if (prev) {
        const back = prev;
        ctx.strokeStyle = rgba(c.p, (c.light ? 0.14 : 0.08) + 0.4 * fade);
        ctx.lineWidth = 1;
        ctx.beginPath();
        pts.forEach(([px, py], i) => { ctx.moveTo(back[i][0], back[i][1]); ctx.lineTo(px, py); });
        ctx.stroke();
      }
      ctx.strokeStyle = beamK > 0
        ? rgba(mix(c.p, c.s, beamK), 0.2 + 0.5 * fade + 0.3 * beamK)
        : rgba(c.p, (c.light ? 0.16 : 0.1) + 0.45 * fade);
      ctx.lineWidth = beamK > 0.5 ? 2 : 1;
      ctx.beginPath();
      polyline(ctx, pts);
      ctx.stroke();
      prev = pts;
    }
    ctx.lineWidth = 1;
    // Survey points on the peaks, scrolling with the terrain
    st.nextMark -= dt;
    if (st.nextMark <= 0 && st.marks.length < 4) {
      st.nextMark = rand(1.2, 2.6);
      const zw = st.scroll + rand(4, 10);
      let best = 0;
      let bh = -1;
      for (let k = 0; k < 14; k += 1) {
        const x = rand(-9, 9);
        if (Math.abs(x) < 3) continue;
        const hh = height(x, zw);
        if (hh > bh) { bh = hh; best = x; }
      }
      st.marks.push({ x: best, zw, n: Math.floor(rand(10, 99)) });
    }
    const locale = s.lang === 'en' ? 'en-US' : 'fr-FR';
    ctx.font = `600 10px ${MONO}`;
    st.marks = st.marks.filter((mk: { x: number; zw: number; n: number }) => {
      const z = mk.zw - st.scroll;
      if (z < ZN + 0.3) return false;
      const hh = height(mk.x, mk.zw);
      const [px, py] = P(mk.x, z, hh);
      const fade = Math.min(1, (1 - z / ZF) * 2);
      ctx.strokeStyle = rgba(c.a, 0.8 * fade);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 34); ctx.stroke();
      ctx.fillStyle = rgba(c.a, 0.95 * fade);
      ctx.beginPath(); ctx.arc(px, py, 2.6, 0, TAU); ctx.fill();
      ctx.fillText(`P-${mk.n} · ${Math.round(hh * 900).toLocaleString(locale)} M`, px + 6, py - 26);
      return true;
    });
    // Bottom right, like the other backgrounds: the hero's text fills the left-hand side
    ctx.fillStyle = rgba(c.mu, 0.9);
    ctx.textAlign = 'right';
    const sector = String(Math.floor(st.scroll / CELL)).padStart(4, '0');
    ctx.fillText(tr(s, `RELEVÉ TOPOGRAPHIQUE · SECTEUR ${sector}`, `TOPOGRAPHIC SURVEY · SECTOR ${sector}`), w - 16, h - 14);
    ctx.textAlign = 'start';
  },
};

// About · Planetary hologram: a point-cloud Earth above its projector, with links flying from
// Rennes to the rest of the world
const hologram: Scene = {
  init() {
    const pts = [];
    const n = 3400;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i += 1) {
      const y = 1 - (i / (n - 1)) * 2;
      const lat = Math.asin(y);
      let lon = (golden * i) % TAU;
      if (lon > Math.PI) lon -= TAU;
      pts.push({ lat, lon, cl: Math.cos(lat), sl: y, land: isLand(lat / DEG, lon / DEG) });
    }
    return { pts, arcs: [], nextArc: 0, glitch: 0, nextGlitch: rand(4, 7), stars: Array.from({ length: 70 }, () => [rand(), rand(), rand(TAU)]) };
  },
  frame(s, dt) {
    const { ctx, w, h, c, t, st } = s;
    ctx.fillStyle = rgba(c.b);
    ctx.fillRect(0, 0, w, h);
    st.stars.forEach(([x, y, ph]: [number, number, number]) => {
      ctx.fillStyle = rgba(c.fg, 0.15 + 0.2 * Math.sin(t * 1.4 + ph));
      ctx.fillRect(x * w, y * h, 1.5, 1.5);
    });
    const narrow = w < 600;
    const { fx, fy, fw } = s.focus;
    const gx = w * fx + (s.mx - 0.5) * 20;
    const R = Math.min(w * (narrow ? 0.32 : 0.24), h * (narrow ? 0.2 : 0.32), fw ? w * fw * 0.42 : Infinity);
    const gy = h * fy;
    const rot = t * 0.2 + (s.mx - 0.5) * 1.2;
    const tilt = 0.38 + (s.my - 0.5) * 0.4;
    const ct = Math.cos(tilt);
    const stl = Math.sin(tilt);
    const project = (x: number, y: number, z: number): [number, number, number] => {
      const xr = x * Math.cos(rot) + z * Math.sin(rot);
      const zr = -x * Math.sin(rot) + z * Math.cos(rot);
      const y2 = y * ct - zr * stl;
      const z2 = y * stl + zr * ct;
      return [gx + R * xr, gy - R * y2, z2];
    };
    const flicker = 0.86 + 0.14 * Math.sin(t * 31) * Math.sin(t * 7.3) - (Math.random() < 0.03 ? 0.25 : 0);

    // Projector: light cone, rising scan lines and the emitter rings
    const baseY = gy + R * 1.55;
    const rx = R * 0.6;
    const cone = ctx.createLinearGradient(0, baseY, 0, gy);
    cone.addColorStop(0, rgba(c.p, (c.light ? 0.2 : 0.18) * flicker));
    cone.addColorStop(1, rgba(c.p, 0));
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(gx - rx, baseY); ctx.lineTo(gx - R * 1.02, gy + R * 0.15); ctx.lineTo(gx + R * 1.02, gy + R * 0.15); ctx.lineTo(gx + rx, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = rgba(c.p, 0.18 * flicker);
    ctx.lineWidth = 1;
    for (let k = 0; k < 14; k += 1) {
      const y = baseY - ((t * 38 + k * 16) % (baseY - gy));
      ctx.beginPath(); ctx.moveTo(gx - R * 1.1, y); ctx.lineTo(gx + R * 1.1, y); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = rgba(c.p, 0.55);
    ctx.beginPath(); ctx.ellipse(gx, baseY, rx, R * 0.1, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(c.s, 0.7);
    ctx.beginPath(); ctx.ellipse(gx, baseY, rx * 1.4, R * 0.16, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(c.p, 0.4);
    ctx.beginPath(); ctx.ellipse(gx, baseY + 8, rx * 1.9, R * 0.22, 0, 0, TAU); ctx.stroke();

    const halo = ctx.createRadialGradient(gx, gy, R * 0.6, gx, gy, R * 1.25);
    halo.addColorStop(0, rgba(c.p, 0));
    halo.addColorStop(0.8, rgba(c.p, 0.08 * flicker));
    halo.addColorStop(1, rgba(c.p, 0));
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(gx, gy, R * 1.25, 0, TAU); ctx.fill();

    // Globe: land behind faint, sea in front as dust, land in front brighter with depth
    const backPts: number[] = [];
    const frontLand: number[] = [];
    const frontSea: number[] = [];
    st.pts.forEach((p: { lon: number; cl: number; sl: number; land: boolean }) => {
      const [x, y, z] = project(p.cl * Math.sin(p.lon), p.sl, p.cl * Math.cos(p.lon));
      if (z < 0) { if (p.land) backPts.push(x, y); } else if (p.land) frontLand.push(x, y, z); else frontSea.push(x, y);
    });
    ctx.fillStyle = rgba(c.p, 0.12 * flicker);
    for (let i = 0; i < backPts.length; i += 2) ctx.fillRect(backPts[i], backPts[i + 1], 1.4, 1.4);
    ctx.fillStyle = rgba(c.s, 0.13 * flicker);
    for (let i = 0; i < frontSea.length; i += 2) ctx.fillRect(frontSea[i], frontSea[i + 1], 1, 1);
    for (let i = 0; i < frontLand.length; i += 3) {
      ctx.fillStyle = rgba(c.p, (0.5 + 0.5 * frontLand[i + 2]) * flicker);
      ctx.fillRect(frontLand[i] - 1.2, frontLand[i + 1] - 1.2, 2.4, 2.4);
    }
    ctx.strokeStyle = rgba(c.p, 0.55 * flicker);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(gx, gy, R, 0, TAU); ctx.stroke();

    ([[1.32, 0.3, 1], [1.5, 0.22, -0.7]] as const).forEach(([k, squash, dir], i) => {
      ctx.setLineDash(i ? [2, 8] : [14, 6, 2, 6]);
      ctx.lineDashOffset = -t * 30 * dir;
      ctx.strokeStyle = rgba(i ? c.s : c.p, 0.5 * flicker);
      ctx.beginPath(); ctx.ellipse(gx, gy, R * k, R * k * squash, -0.25, 0, TAU); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Links: great-circle arcs, most of them from Rennes
    st.nextArc -= dt;
    if (st.nextArc <= 0) {
      st.nextArc = rand(0.3, 0.6);
      const names = Object.keys(CITIES);
      const from = Math.random() < 0.6 ? 'Rennes' : pick(names);
      let to = pick(names);
      while (to === from) to = pick(names);
      st.arcs.push({ A: unit(CITIES[from]), B: unit(CITIES[to]), t: 0, dur: rand(1.6, 2.4), rennes: from === 'Rennes' });
    }
    type Arc = { A: [number, number, number]; B: [number, number, number]; t: number; dur: number; rennes: boolean };
    st.arcs = st.arcs.filter((arc: Arc) => (arc.t += dt) < arc.dur + 0.8);
    st.arcs.forEach((arc: Arc) => {
      const { A, B } = arc;
      const omega = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1));
      const so = Math.sin(omega) || 1;
      const head = clamp(arc.t / arc.dur, 0, 1);
      const tail = clamp((arc.t - 0.8) / arc.dur, 0, 1);
      const pts: [number, number, boolean][] = [];
      for (let i = 0; i <= 40; i += 1) {
        const u = tail + ((head - tail) * i) / 40;
        const ka = Math.sin((1 - u) * omega) / so;
        const kb = Math.sin(u * omega) / so;
        const lift = 1 + 0.22 * Math.sin(Math.PI * u) * Math.min(1, omega);
        const [x, y, z] = project((A[0] * ka + B[0] * kb) * lift, (A[1] * ka + B[1] * kb) * lift, (A[2] * ka + B[2] * kb) * lift);
        const hidden = z < 0 && Math.hypot(x - gx, y - gy) < R;
        pts.push([x, y, hidden]);
      }
      const col = arc.rennes ? c.a : c.s;
      ctx.lineWidth = 1.6;
      for (let i = 1; i < pts.length; i += 1) {
        if (pts[i][2] || pts[i - 1][2]) continue;
        ctx.strokeStyle = rgba(col, (i / pts.length) * 0.95 * flicker);
        ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
      }
      const last = pts[pts.length - 1];
      if (!last[2] && head < 1) { ctx.fillStyle = rgba(c.fg, 0.95); ctx.beginPath(); ctx.arc(last[0], last[1], 2.4, 0, TAU); ctx.fill(); }
    });

    Object.entries(CITIES).forEach(([name, ll]) => {
      const u = unit(ll);
      const [x, y, z] = project(u[0], u[1], u[2]);
      if (z < 0.05) return;
      const rennes = name === 'Rennes';
      ctx.fillStyle = rgba(rennes ? c.a : c.s, 0.95);
      ctx.beginPath(); ctx.arc(x, y, rennes ? 3.5 : 2, 0, TAU); ctx.fill();
      if (rennes) {
        [0, 0.5].forEach((off) => {
          const ph = (t * 0.6 + off) % 1;
          ctx.strokeStyle = rgba(c.a, (1 - ph) * 0.9);
          ctx.beginPath(); ctx.arc(x, y, 4 + 20 * ph, 0, TAU); ctx.stroke();
        });
        ctx.font = `600 11px ${MONO}`;
        ctx.fillStyle = rgba(c.fg, 0.92);
        ctx.fillText(tr(s, 'RENNES · 48.11°N 1.68°O', 'RENNES · 48.11°N 1.68°W'), x + 12, y - 12);
      }
    });

    ctx.save();
    ctx.beginPath(); ctx.arc(gx, gy, R * 1.02, 0, TAU); ctx.clip();
    ctx.fillStyle = rgba(c.b, 0.22);
    for (let y = gy - R; y < gy + R; y += 3) ctx.fillRect(gx - R, y, R * 2, 1);
    ctx.restore();

    const streams = String(st.arcs.length).padStart(2, '0');
    const latency = Math.round(18 + Math.sin(t) * 4);
    ctx.font = `600 10.5px ${MONO}`;
    ctx.fillStyle = rgba(c.p, 0.9);
    ctx.textAlign = 'right';
    ctx.fillText(tr(s, `LIAISON MONTANTE · ${streams} FLUX · LATENCE ${latency} ms`, `UPLINK · ${streams} STREAMS · LATENCY ${latency} ms`), w - 16, h - 14);
    ctx.textAlign = 'start';
    st.nextGlitch -= dt;
    if (st.nextGlitch <= 0) { st.glitch = 0.3; st.nextGlitch = rand(5, 9); }
    if (st.glitch > 0) {
      st.glitch -= dt;
      glitchSlices(s, 0.7, { x: Math.max(0, gx - R * 1.6), y: Math.max(0, gy - R * 1.4), w: Math.min(R * 3.2, w - (gx - R * 1.6)), h: Math.min(R * 3.2, h) });
    }
  },
};

// Projects · Autorouting: a dense board draws itself. Several traces are routed at once (more and
// more), with the Lee search visible as a wave; the links cross the screen between the edge
// connectors and the chips. Then the board is powered, fades out, and a new one is routed.
const pcbRoute: Scene = {
  init(s) {
    return {
      board: makeBoard(s.w, s.h), next: 0, active: [], done: 0,
      phase: 'route', pt: 0, pulses: [], spawn: 0, probe: null, key: '', roll: 0, speed: 1.7,
    };
  },
  frame(s, dt) {
    const { ctx, w, h, c, st } = s;
    let B: Board = st.board;
    const key = [c.b, c.p, c.s, c.fg, c.mu, s.dpr, s.lang].join('|');
    if (st.key !== key) {
      st.pcb = makeLayer(s, w, h);
      drawBoard(s, st.pcb, B, B.nets.filter((net) => net.done));
      st.key = key;
    }
    st.pt += dt;
    ctx.drawImage(st.pcb.cv, 0, 0, w, h);
    let hud = '';
    if (st.phase === 'route') {
      // 2 traces at once to begin with, one more every 0.5 s, up to 8
      const par = Math.min(8, 2 + Math.floor(st.pt / 0.5));
      while (st.active.length < par && st.next < B.nets.length) st.active.push({ net: B.nets[st.next++], t: 0 });
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      st.active = st.active.filter((job: { net: Net; t: number }) => {
        job.t += dt;
        const { net } = job;
        // About 2,500 cells a second: fast enough for the board to fill up, slow enough for the
        // wave to be followed without flashing
        const sdur = clamp(net.visited.length / 2500, 0.35, 0.9);
        const tdur = clamp(net.geo.len / 1600, 0.18, 0.45);
        if (job.t < sdur) {
          // Search front: the last cells visited, in four intensities, faded in and out, and
          // paler when several traces are routed at once
          const n = Math.floor(net.visited.length * (job.t / sdur));
          const band = 150;
          const from = Math.max(0, n - band);
          const fade = Math.min(1, job.t / 0.15, (sdur - job.t) / 0.15) / Math.max(1, st.active.length / 4);
          const size = B.G * 0.6;
          const buckets = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
          for (let i = from; i < n; i += 1) {
            const v = net.visited[i];
            buckets[Math.min(3, Math.floor(((i - from) / band) * 4))]
              .rect(B.X(v % B.cols) - size / 2, B.Y(Math.floor(v / B.cols)) - size / 2, size, size);
          }
          buckets.forEach((p, k) => { ctx.fillStyle = rgba(c.s, [0.04, 0.08, 0.13, 0.22][k] * fade); ctx.fill(p); });
          ctx.strokeStyle = rgba(c.a, 0.9);
          ctx.lineWidth = 1.5;
          [net.a, net.b].forEach((pin) => ctx.strokeRect(B.X(pin.x) - 7, B.Y(pin.y) - 7, 14, 14));
          return true;
        }
        if (job.t < sdur + tdur) {
          const pts = pathSlice(net.geo, 0, net.geo.len * smooth((job.t - sdur) / tdur));
          ctx.strokeStyle = rgba(c.s, 0.25);
          ctx.lineWidth = 7;
          ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
          ctx.strokeStyle = rgba(mix(c.s, c.fg, 0.3), 0.95);
          ctx.lineWidth = 2.4;
          ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
          return true;
        }
        // Trace done: it joins the board layer
        const x = st.pcb.cx as CanvasRenderingContext2D;
        drawNets(x, c, [net]);
        drawPad(x, B, c, net.a, 0);
        drawPad(x, B, c, net.b, 0);
        net.done = true;
        net.a.flash = 1;
        net.b.flash = 1;
        st.done += 1;
        return false;
      });
      ctx.lineCap = 'butt';
      ctx.lineWidth = 1;
      hud = tr(s, `AUTOROUTAGE · ${st.done}/${B.nets.length} PISTES · ${st.active.length} EN PARALLÈLE`,
        `AUTOROUTING · ${st.done}/${B.nets.length} TRACES · ${st.active.length} IN PARALLEL`);
      if (!st.active.length && st.next >= B.nets.length) { st.phase = 'power'; st.pt = 0; }
    } else if (st.phase === 'power') {
      pcbProbe(s, st, B);
      hud = tr(s, `MISE SOUS TENSION · ${B.nets.length} PISTES · 3,3 V`, `POWER ON · ${B.nets.length} TRACES · 3.3 V`);
      if (st.pt > 5) { st.phase = 'fade'; st.pt = 0; }
    }
    if (st.phase !== 'power') st.probe = null;
    pcbPulses(s, st, B, dt, st.phase === 'power' ? 9 : 0);
    if (st.phase === 'fade') {
      ctx.fillStyle = rgba(c.b, Math.min(1, st.pt / 0.9));
      ctx.fillRect(0, 0, w, h);
      hud = tr(s, 'NOUVELLE CARTE', 'NEW BOARD');
      if (st.pt > 1) {
        st.board = makeBoard(w, h);
        B = st.board;
        Object.assign(st, { next: 0, active: [], done: 0, pulses: [], phase: 'route', pt: 0, key: '' });
      }
    }
    st.roll += dt * 18;
    scanlines(s, st, c.b, c.light ? 0.12 : 0.22, st.roll);
    ctx.font = `600 10px ${MONO}`;
    ctx.fillStyle = rgba(c.mu, 0.95);
    ctx.textAlign = 'right';
    ctx.fillText(hud, w - 16, h - 14);
    ctx.textAlign = 'start';
  },
};

// Interests · Holographic interference: the two halos of the original grid move, light the grid
// up and make fringes appear on its nodes; the pointer adds a third source.
// Light on pixels: 30 images a second, background and halos computed at a quarter of the
// resolution then scaled up in one pass, base grid and scan lines pre-rendered into a layer.
const holoGrid: Scene = {
  init() {
    return { flick: 0, nextFlick: rand(2, 5), acc: 1, key: '' };
  },
  frame(s, dt) {
    const { ctx, w, h, c, t, st } = s;
    st.acc += dt;
    if (st.acc < 1 / 30) return;
    const step = Math.min(st.acc, 0.1);
    st.acc = 0;
    const G = 30;
    const grid = gridPath(st, w, h, G);
    const key = [w, h, s.dpr, c.p, c.b].join('|');
    if (st.key !== key) {
      st.base = makeLayer(s, w, h);
      const x = st.base.cx as CanvasRenderingContext2D;
      x.strokeStyle = rgba(c.p, c.light ? 0.1 : 0.07);
      x.lineWidth = 1;
      x.stroke(grid);
      x.fillStyle = rgba(c.p, c.light ? 0.04 : 0.06);
      for (let y = 2; y < h; y += 4) x.fillRect(0, y, w, 2);
      const low = document.createElement('canvas');
      low.width = Math.max(1, Math.ceil(w / 4));
      low.height = Math.max(1, Math.ceil(h / 4));
      st.low = low;
      st.key = key;
    }
    const { fx, fy, fw } = s.focus;
    const cx = w * fx;
    const cy = h * fy;
    const span = Math.min(w * 0.22, fw ? w * fw * 0.35 : Infinity);
    const ghz = (v: string) => tr(s, v, v.replace(',', '.'));
    const srcs: [number, number, string][] = [
      [cx - span + Math.sin(t * 0.21) * w * 0.08, cy - h * 0.1 + Math.sin(t * 0.17 + 1) * h * 0.14, `SRC-A · ${ghz('2,40')} GHz`],
      [cx + span + Math.sin(t * 0.19 + 2) * w * 0.08, cy + h * 0.1 + Math.cos(t * 0.23) * h * 0.14, `SRC-B · ${ghz('2,41')} GHz`],
    ];
    if (s.pin) srcs.push([s.px * w, s.py * h, tr(s, 'SRC-C · SONDE', 'SRC-C · PROBE')]);
    const big = Math.max(w, h);
    // Background and halos at a quarter of the resolution: blurry by nature, one scaling is enough
    const low = st.low as HTMLCanvasElement;
    const lx = low.getContext('2d') as CanvasRenderingContext2D;
    lx.globalCompositeOperation = 'source-over';
    lx.fillStyle = rgba(c.b);
    lx.fillRect(0, 0, low.width, low.height);
    lx.globalCompositeOperation = c.light ? 'source-over' : 'lighter';
    srcs.forEach(([x, y], i) => {
      const R = (big * (i < 2 ? 0.36 : 0.2)) / 4;
      const g = lx.createRadialGradient(x / 4, y / 4, 0, x / 4, y / 4, R);
      g.addColorStop(0, rgba(c.p, c.light ? 0.08 : 0.1));
      g.addColorStop(1, rgba(c.p, 0));
      lx.fillStyle = g;
      lx.fillRect(x / 4 - R, y / 4 - R, 2 * R, 2 * R);
    });
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(low, 0, 0, w, h);
    ctx.drawImage(st.base.cv, 0, 0, w, h);
    // The grid lit around each source (thin lines: few pixels)
    ctx.lineWidth = 1;
    srcs.forEach(([x, y], i) => {
      const R = big * (i < 2 ? 0.3 : 0.18);
      const g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, rgba(c.p, 0.5));
      g.addColorStop(0.5, rgba(c.p, 0.13));
      g.addColorStop(1, rgba(c.p, 0));
      ctx.strokeStyle = g;
      ctx.stroke(grid);
    });
    // Wave fronts sent out by the sources
    srcs.forEach(([x, y]) => {
      for (let k = 0; k < 3; k += 1) {
        const r = (t * 70 + k * 140) % 420;
        ctx.strokeStyle = rgba(c.s, 0.3 * (1 - r / 420));
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      }
    });
    // Interference fringes, read on the grid nodes
    const kk = TAU / 48;
    const strong = new Path2D();
    const soft = new Path2D();
    for (let y = 0; y <= h; y += G) {
      for (let x = 0; x <= w; x += G) {
        let I = 0;
        for (const [sx, sy] of srcs) I += Math.cos(Math.hypot(x - sx, y - sy) * kk - t * 3);
        I /= srcs.length;
        if (I > 0.8) strong.rect(x - 1, y - 1, 3, 3);
        else if (I > 0.55) soft.rect(x - 0.5, y - 0.5, 2, 2);
      }
    }
    ctx.fillStyle = rgba(c.s, 0.9);
    ctx.fill(strong);
    ctx.fillStyle = rgba(c.s, 0.4);
    ctx.fill(soft);
    ctx.font = `600 10px ${MONO}`;
    srcs.forEach(([x, y, label]) => {
      ctx.strokeStyle = rgba(c.p, 0.9);
      ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke();
      ctx.fillStyle = rgba(c.p, 0.9);
      ctx.fillText(label, x + 10, y - 10);
    });
    // Flicker now and then: a chromatic copy of the grid and shifted slices
    st.nextFlick -= step;
    if (st.nextFlick <= 0) { st.flick = 0.18; st.nextFlick = rand(3, 7); }
    if (st.flick > 0) {
      st.flick -= step;
      ctx.save();
      ctx.translate(rand(-4, 4), 0);
      ctx.strokeStyle = rgba(c.s, 0.25);
      ctx.stroke(grid);
      ctx.restore();
      glitchSlices(s, 0.35);
    }
    const dphi = Math.round(((((srcs[0][0] - srcs[1][0]) * kk) % TAU) + TAU) % TAU / DEG);
    ctx.fillStyle = rgba(c.mu, 0.95);
    ctx.textAlign = 'right';
    ctx.fillText(`HOLO · ${srcs.length} SOURCES · Δφ ${dphi}°`, w - 16, h - 14);
    ctx.textAlign = 'start';
  },
};

export const SCENES = { gridTerrain, hologram, pcbRoute, holoGrid };
export type SceneName = keyof typeof SCENES;
