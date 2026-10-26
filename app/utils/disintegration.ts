// The "disintegration" self-destruct sequence: every visible pixel of the screen becomes a WebGL
// point of its own colour; the wind tears them away in ribbons, they gather into a vortex around the
// camera, then stream away into the distance. All the motion is computed in the vertex shader from
// the time. Browser-only.
//
// World units, as for the megapolis: the screen is always 800 units high.

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (p: number) => p * p * (3 - 2 * p);
export const span = (t: number, t0: number, t1: number) => smooth(clamp((t - t0) / (t1 - t0), 0, 1));

const FOV = (50 * Math.PI) / 180;
// Camera distance at which the screen exactly fills the 50° vertical field of view
export const DIST = 400 / Math.tan(FOV / 2);
// Beyond this, a pixel out of two (or three…) becomes a particle: light themes have far more
// visible pixels than dark ones
const MAX_PARTICLES = 300000;

const VS = `
attribute vec2 aHome; attribute vec3 aColor; attribute vec4 aSeed;
uniform mat4 uMVP; uniform float uT; uniform float uMode; uniform float uPs; uniform float uDist; uniform float uHalfW; uniform vec3 uAway;
varying vec3 vColor; varying float vAlpha; varying float vSoft;
void main() {
  vec3 home = vec3(aHome, 0.0);
  vec3 p = home;
  float alpha = 1.0, soft = 0.0, size = 1.0;
  if (uMode < 0.5) {
    // The wind front crosses the screen from left to right, with a ragged edge
    float release = 3.0 + ((aHome.x + uHalfW) / (2.0 * uHalfW)) * 6.0 + aSeed.x * 1.4 + sin(aHome.y * 0.02) * 0.3;
    float age = max(0.0, uT - release);
    p.z += sin(uT * 7.0 + aSeed.y * 40.0) * smoothstep(1.0, 3.0, uT) * 2.0 * (1.0 - step(0.0001, age));
    if (age > 0.0) {
      float a = min(age, 14.0);
      // The wind pushes right, up and away into the depth, so the cloud stays in the frame
      vec3 wind = vec3(a * 70.0 + a * a * 8.0, a * 30.0, -a * a * 24.0 * (0.4 + aSeed.z));
      // Noise driven by the home position: neighbours move together, so the pixels leave in ribbons
      vec3 h = home * 0.006;
      vec3 turb = vec3(sin(h.y * 3.1 + a * 1.3 + aSeed.w * 1.5), sin(h.x * 2.3 + a * 1.1 + aSeed.z), cos(h.x * 1.7 + h.y * 2.9 + a * 0.9)) * (30.0 + a * 75.0);
      p = home + wind + turb;
      soft = smoothstep(0.0, 1.2, age);
      size = 1.0 + smoothstep(0.0, 2.0, age) * 1.4;
    }
    // Everything gathers into a spiral vortex lying flat, seen from above: two arms wound in
    // logarithmic spirals, a quarter of the particles in a fainter disk between them, a thick bright
    // core. The particles stream inward along the arms while the whole spiral turns. Each feature
    // takes its own random value: tied to the radius, they would draw rings.
    float vk = smoothstep(11.0, 14.5, uT);
    if (vk > 0.0) {
      float flow = fract(aSeed.y - max(0.0, uT - 11.0) * 0.06);
      float r = 40.0 + flow * 960.0;
      float arm = floor(aSeed.x * 2.0) * 3.1416;
      float spread = aSeed.w > 0.25 ? (aSeed.z + fract(aSeed.w * 7.13) - 1.0) * 0.32 : aSeed.z * 6.2832;
      float th = arm + log(r / 40.0) * 1.5 + spread - (uT - 11.0) * 0.35;
      float thick = (fract(aSeed.x * 2.0) - 0.5) * (16.0 + 200.0 * exp(-r / 140.0));
      vec3 vortex = vec3(cos(th) * r, thick, sin(th) * r);
      p = mix(p, vortex, vk);
      // In at the rim, out at the core: a particle that wraps round is never seen jumping
      alpha *= mix(1.0, smoothstep(0.0, 0.08, flow) * smoothstep(1.0, 0.85, flow), vk);
      soft = max(soft, vk);
      size = max(size, 1.0 + vk * 1.4);
    }
    // Then the spiral opens a little and recedes straight away from the camera, each particle at its
    // own speed: it stays in the middle of the frame and shrinks into a field of stars
    float dk = max(0.0, uT - 18.0);
    if (dk > 0.0) {
      vec2 dir = normalize(p.xz + vec2(0.001));
      p.xz += dir * dk * 60.0;
      p += uAway * dk * dk * (60.0 + aSeed.z * 160.0);
      alpha *= 1.0 - smoothstep(19.0, 25.0, uT) * (0.75 + aSeed.w * 0.25);
    }
  } else {
    // Reassembly: back from the far field along curves, each pixel landing on its own place
    float k = clamp(uT / 2.4 - aSeed.x * 0.25, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - k, 3.0);
    vec3 far = vec3((aSeed.y - 0.5) * 4200.0, (aSeed.z - 0.5) * 2600.0, -2500.0 - aSeed.w * 3500.0);
    p = mix(far, home, e) + vec3(0.0, sin(k * 3.1416) * 260.0 * (aSeed.w - 0.5), 0.0);
    soft = 1.0 - e;
    size = 1.0 + (1.0 - e) * 0.9;
    alpha = smoothstep(0.0, 0.15, k);
  }
  vec4 clip = uMVP * vec4(p, 1.0);
  gl_Position = clip;
  gl_PointSize = min(uPs * size * uDist / max(clip.w, 1.0), 14.0);
  vColor = aColor;
  vAlpha = alpha;
  vSoft = soft;
}`;
const FS = `
precision mediump float;
varying vec3 vColor; varying float vAlpha; varying float vSoft;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = mix(1.0, 1.0 - smoothstep(0.2, 0.5, r), vSoft) * vAlpha;
  if (a < 0.01) discard;
  // A touch brighter in flight; additive blending makes crossing ribbons glow
  gl_FragColor = vec4(vColor * a * (1.0 + vSoft * 0.2), 1.0);
}`;

/* ---------- Camera ---------- */

export interface Camera {
  rx: number;
  ry: number;
  dist: number;
}

// Tilt and pull back, sweep with the wind, then lean over the vortex to see its arms from above
// and circle it
export function cameraAt(t: number): Camera {
  let ry = -0.36 * span(t, 1, 3) + 0.72 * span(t, 3, 11);
  if (t > 11) ry += (t - 11) * 0.32 - Math.max(0, t - 18) * 0.12;
  return {
    rx: 0.26 * span(t, 1, 3) - 0.1 * span(t, 3, 11) + 0.7 * span(t, 10.5, 14),
    ry,
    dist: DIST * (1 + 0.28 * span(t, 1, 3) + 0.45 * span(t, 10, 14) + 0.5 * span(t, 18, 23)),
  };
}

// Perspective × view: the camera orbits the origin at a given distance (column-major)
function viewProjection(aspect: number, { rx, ry, dist }: Camera): Float32Array {
  const f = 1 / Math.tan(FOV / 2);
  const near = 5;
  const far = 20000;
  const P = [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  // translate(0, 0, -dist) · rotateX(rx) · rotateY(ry)
  const V = [cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1];
  const M = new Float32Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      let s = 0;
      for (let i = 0; i < 4; i += 1) s += (P[i * 4 + r] ?? 0) * (V[c * 4 + i] ?? 0);
      M[c * 4 + r] = s;
    }
  }
  return M;
}

/* ---------- The particles ---------- */

export interface Dust {
  count: number;
  draw: (t: number, mode: 0 | 1, cam: Camera) => void;
  dispose: () => void;
}

// screen: the image of the screen (from megapolis.ts). Null when WebGL is missing or fails.
export function createDust(canvas: HTMLCanvasElement, screen: HTMLCanvasElement): Dust | null {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const u = 800 / H;
  const halfW = (W * u) / 2;
  const pixels = screen.getContext('2d')?.getImageData(0, 0, screen.width, screen.height).data;
  if (!pixels) return null;
  const scale = screen.width / W;
  const lit = (x: number, y: number) => {
    const i = (Math.floor(y * scale) * screen.width + Math.floor(x * scale)) * 4;
    return (pixels[i] ?? 0) + (pixels[i + 1] ?? 0) + (pixels[i + 2] ?? 0) >= 40;
  };
  // One particle per lit pixel, or per block of pixels when there are too many
  let visible = 0;
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (lit(x, y)) visible += 1;
  const stride = Math.max(1, Math.ceil(Math.sqrt(visible / MAX_PARTICLES)));
  // 9 floats per particle: home (2), colour (3), four random values
  const data = new Float32Array(Math.ceil(W / stride) * Math.ceil(H / stride) * 9);
  let count = 0;
  for (let y = 0; y < H; y += stride) {
    for (let x = 0; x < W; x += stride) {
      const cx = Math.min(W - 1, x + stride / 2);
      const cy = Math.min(H - 1, y + stride / 2);
      if (!lit(cx, cy)) continue;
      const i = (Math.floor(cy * scale) * screen.width + Math.floor(cx * scale)) * 4;
      data.set([cx * u - halfW, 400 - cy * u, (pixels[i] ?? 0) / 255, (pixels[i + 1] ?? 0) / 255, (pixels[i + 2] ?? 0) / 255,
        Math.random(), Math.random(), Math.random(), Math.random()], count * 9);
      count += 1;
    }
  }

  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;
  function compile(type: number, source: string): WebGLShader {
    const shader = gl?.createShader(type);
    if (!gl || !shader) throw new Error('shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
    return shader;
  }
  const program = gl.createProgram();
  if (!program) return null;
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  const at = {
    home: gl.getAttribLocation(program, 'aHome'),
    color: gl.getAttribLocation(program, 'aColor'),
    seed: gl.getAttribLocation(program, 'aSeed'),
  };
  const un = {
    mvp: gl.getUniformLocation(program, 'uMVP'),
    t: gl.getUniformLocation(program, 'uT'),
    mode: gl.getUniformLocation(program, 'uMode'),
    ps: gl.getUniformLocation(program, 'uPs'),
    dist: gl.getUniformLocation(program, 'uDist'),
    halfW: gl.getUniformLocation(program, 'uHalfW'),
    away: gl.getUniformLocation(program, 'uAway'),
  };
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, count * 9), gl.STATIC_DRAW);

  // Drawing buffer: the screen at the device's resolution, within what a GPU handles easily
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(Math.min(W * dpr, 2560)));
  canvas.height = Math.round((canvas.width * H) / W);
  // At rest, each point covers its block of the screen exactly
  const pointSize = (stride * canvas.height) / H;

  return {
    count,
    draw(t, mode, cam) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!count) return;
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(at.home);
      gl.vertexAttribPointer(at.home, 2, gl.FLOAT, false, 36, 0);
      gl.enableVertexAttribArray(at.color);
      gl.vertexAttribPointer(at.color, 3, gl.FLOAT, false, 36, 8);
      gl.enableVertexAttribArray(at.seed);
      gl.vertexAttribPointer(at.seed, 4, gl.FLOAT, false, 36, 20);
      gl.uniformMatrix4fv(un.mvp, false, viewProjection(W / H, cam));
      gl.uniform1f(un.t, t);
      gl.uniform1f(un.mode, mode);
      gl.uniform1f(un.dist, DIST);
      gl.uniform1f(un.ps, pointSize);
      gl.uniform1f(un.halfW, halfW);
      // From the camera toward the point it looks at: the camera orbits the origin
      gl.uniform3f(un.away, Math.cos(cam.rx) * Math.sin(cam.ry), -Math.sin(cam.rx), -Math.cos(cam.rx) * Math.cos(cam.ry));
      gl.drawArrays(gl.POINTS, 0, count);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      // Frees the GPU now rather than whenever the canvas is collected
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

/* ---------- Without WebGL, or with less motion ---------- */

// The image of the screen redrawn in ever larger pixels as it fades: progress 0 (the screen as it
// is) → 1 (nothing left)
export function createPixelFade(canvas: HTMLCanvasElement, screen: HTMLCanvasElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  const small = document.createElement('canvas');
  const s = small.getContext('2d');
  return (progress: number) => {
    if (!g || !s) return;
    const block = Math.max(1, Math.round(1 + 47 * progress ** 1.5));
    small.width = Math.max(1, Math.ceil(W / block));
    small.height = Math.max(1, Math.ceil(H / block));
    s.imageSmoothingEnabled = true;
    s.drawImage(screen, 0, 0, small.width, small.height);
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1 - progress;
    g.imageSmoothingEnabled = false;
    g.drawImage(small, 0, 0, small.width * block, small.height * block);
    g.globalAlpha = 1;
  };
}
