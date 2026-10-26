// The "overheat" sequence drawn in WebGL: the screen as one image (the live animated background
// under it), heat colours and shimmer computed in shaders, the melt as strips of a mesh. A single
// canvas instead of dozens of copies of the screen under an SVG filter: Firefox draws SVG filters
// and moving copies on the CPU, which brought it down to a frame a second. Browser-only.

import { paintPage } from './megapolis';
import { pageBackdrop } from './selfDestructScreen';
import type { Strip } from './overheat';

// Most strips the vertex shader takes (one vec4 uniform each)
export const MAX_STRIPS = 48;

const PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif`;

// The heat shimmer, as the SVG filter it replaces (feTurbulence type="turbulence", base frequency
// 0.012 0.045, 2 octaves, into feDisplacementMap): the sum of the absolute values of two octaves of
// gradient noise, whose creases make the picture break up in fine horizontal bands. A new pattern
// about 11 times a second makes it boil.
const SHIMMER = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float perlin(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a00 = hash(i) * 6.2832, a10 = hash(i + vec2(1.0, 0.0)) * 6.2832;
  float a01 = hash(i + vec2(0.0, 1.0)) * 6.2832, a11 = hash(i + vec2(1.0, 1.0)) * 6.2832;
  float n00 = dot(vec2(cos(a00), sin(a00)), f);
  float n10 = dot(vec2(cos(a10), sin(a10)), f - vec2(1.0, 0.0));
  float n01 = dot(vec2(cos(a01), sin(a01)), f - vec2(0.0, 1.0));
  float n11 = dot(vec2(cos(a11), sin(a11)), f - vec2(1.0, 1.0));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}
float turbulence(vec2 q) { return abs(perlin(q)) + 0.5 * abs(perlin(q * 2.0)); }
uniform float uSeed;
vec2 shimmer(vec2 p) {
  vec2 q = p * vec2(0.012, 0.045) + vec2(hash(vec2(uSeed, 1.7)), hash(vec2(uSeed, 8.3))) * 97.0;
  // One noise per channel, as the red and green channels of the turbulence; centred like the
  // displacement map, which moves by (value - 0.5) × scale
  return vec2(turbulence(q), turbulence(q + vec2(31.7, 17.3))) - 0.5;
}`;

const STRIP_VS = `
attribute vec2 aRest; attribute float aDip; attribute float aStrip;
uniform vec4 uStrip[${MAX_STRIPS}]; uniform vec2 uView; uniform float uRagged;
varying vec2 vRest;
void main() {
  // uStrip: how far it has slid, its vertical stretch, side shift, tangent of its lean
  vec4 s = uStrip[int(aStrip)];
  float y = aRest.y + aDip * uRagged;
  vec2 p = vec2(aRest.x + y * s.y * s.w + s.z, s.x + y * s.y);
  vRest = vec2(aRest.x, y);
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
}`;

// The screen at rest: the live background (with the fade at the top and bottom of its section),
// the content over it (shimmering on its own before the melt), in the heat colours
const STRIP_FS = `${PRECISION}
uniform sampler2D uContent; uniform sampler2D uBack;
uniform vec2 uSize; uniform vec3 uBackdrop; uniform vec4 uBackRect; uniform vec4 uFadeRect; uniform float uHasBack;
uniform mat3 uGrade; uniform float uBright; uniform float uShimmer;
varying vec2 vRest;
${SHIMMER}
void main() {
  vec3 back = uBackdrop;
  if (uHasBack > 0.5) {
    vec2 b = (vRest - uBackRect.xy) / uBackRect.zw;
    if (b.x >= 0.0 && b.x <= 1.0 && b.y >= 0.0 && b.y <= 1.0) back = texture2D(uBack, b).rgb;
    float top = 1.0 - clamp((vRest.y - uFadeRect.y) / 110.0, 0.0, 1.0);
    float bottom = 1.0 - clamp((uFadeRect.y + uFadeRect.w - vRest.y) / 110.0, 0.0, 1.0);
    back = mix(back, uBackdrop, max(top, bottom));
  }
  vec2 at = vRest;
  if (uShimmer > 0.0) at = clamp(at + shimmer(vRest) * uShimmer, vec2(0.0), uSize);
  vec4 c = texture2D(uContent, at / uSize);
  vec3 col = mix(back, c.rgb, c.a);
  gl_FragColor = vec4(clamp(uGrade * col * uBright, 0.0, 1.0), 1.0);
}`;

const QUAD_VS = 'attribute vec2 aP; void main() { gl_Position = vec4(aP, 0.0, 1.0); }';

// Molten metal, slowly churning, as the CSS gradients it replaces
const LAVA_FS = `${PRECISION}
uniform vec2 uSize; uniform float uDpr; uniform float uTime; uniform float uLava;
vec3 ramp(float d) {
  vec3 a = vec3(1.0, 0.478, 0.102);
  vec3 b = vec3(0.761, 0.188, 0.047);
  vec3 c = vec3(0.29, 0.035, 0.016);
  vec3 e = vec3(0.043, 0.004, 0.004);
  if (d < 0.28) return mix(a, b, d / 0.28);
  if (d < 0.6) return mix(b, c, (d - 0.28) / 0.32);
  return mix(c, e, clamp((d - 0.6) / 0.4, 0.0, 1.0));
}
float blob(vec2 p, vec2 at, vec2 r) { return 1.0 - smoothstep(0.0, 0.7, length((p - at) / r)); }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec3 col = ramp(length((p - vec2(0.5, 1.15) * uSize) / (vec2(0.8, 0.6) * uSize)));
  float churn = 0.5 - 0.5 * cos(uTime * 3.1416 / 3.0);
  vec2 shift = vec2(30.0 * churn, 0.0);
  vec2 stretch = vec2(1.0, 1.0 + 0.1 * churn);
  float glow = blob(p - shift, vec2(0.3, 0.9) * uSize, vec2(0.3, 0.2) * uSize * stretch) * 0.35
    + blob(p - shift, vec2(0.72, 0.95) * uSize, vec2(0.25, 0.18) * uSize * stretch) * 0.3;
  col = mix(col, vec3(1.0, 0.71, 0.24), glow * (1.0 - 0.3 * churn));
  gl_FragColor = vec4(col * uLava, 1.0);
}`;

// The whole scene on screen, shimmering during the melt, with the glow of the heat from the bottom
// of the screen blended like light (as the CSS screen blend it replaces)
const POST_FS = `${PRECISION}
uniform sampler2D uScene; uniform vec2 uSize; uniform float uDpr; uniform float uShimmer;
uniform float uGlow; uniform float uGlowA;
${SHIMMER}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 at = p;
  if (uShimmer > 0.0) at = clamp(p + shimmer(p) * uShimmer, vec2(0.0), uSize);
  vec3 col = texture2D(uScene, vec2(at.x / uSize.x, 1.0 - at.y / uSize.y)).rgb;
  if (uGlowA > 0.0 && uGlow > 0.0) {
    float h = (p.y - uSize.y * (1.0 - uGlow)) / (uSize.y * uGlow);
    if (h > 0.0) {
      vec3 g = h < 0.7 ? vec3(1.0, 0.275, 0.0) * (0.32 * h / 0.7) : mix(vec3(1.0, 0.275, 0.0) * 0.32, vec3(1.0, 0.55, 0.12) * 0.45, (h - 0.7) / 0.3);
      g *= uGlowA;
      col = col + g - col * g;
    }
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export interface SceneLook {
  // Colour matrix (column-major 3 × 3) and brightness of the screen
  grade: number[];
  bright: number;
  // Shimmer in pixels: of the content only (before the melt), of everything (during the melt)
  shimmerContent: number;
  shimmerAll: number;
  // Height of the glow (0 → 1 of the screen) and its strength
  glow: number;
  glowA: number;
  lava: number;
  // 0: the top edges of the strips are straight, 1: torn
  ragged: number;
}

export interface MeltScene {
  draw: (t: number, strips: Strip[], look: SceneLook) => void;
  dispose: () => void;
}

interface Program {
  pr: WebGLProgram;
  a: Record<string, number>;
  u: Record<string, WebGLUniformLocation | null>;
}

// The screen, drawn once without its animated backgrounds, and the live background of the section
// on screen. Throws when WebGL is missing or fails, with the reason. The page must be scrolled to
// the top.
export function createMeltScene(canvas: HTMLCanvasElement, page: HTMLElement, strips: Strip[]): MeltScene {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = Math.hypot(W, H) / 1509;
  if (strips.length > MAX_STRIPS) throw new Error(`${strips.length} strips, at most ${MAX_STRIPS}`);
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) throw new Error('no WebGL');

  function compile(type: number, source: string): WebGLShader {
    const shader = gl?.createShader(type);
    if (!gl || !shader) throw new Error('no shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`shader: ${gl.getShaderInfoLog(shader)}`);
    return shader;
  }
  function program(vs: string, fs: string, attributes: string[], uniforms: string[]): Program {
    const pr = gl?.createProgram();
    if (!gl || !pr) throw new Error('no program');
    gl.attachShader(pr, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(`program: ${gl.getProgramInfoLog(pr)}`);
    const out: Program = { pr, a: {}, u: {} };
    attributes.forEach((name) => { out.a[name] = gl.getAttribLocation(pr, name); });
    uniforms.forEach((name) => { out.u[name] = gl.getUniformLocation(pr, name); });
    return out;
  }
  const P = {
    strips: program(STRIP_VS, STRIP_FS, ['aRest', 'aDip', 'aStrip'], ['uStrip', 'uView', 'uRagged', 'uSize', 'uContent', 'uBack', 'uBackdrop', 'uBackRect', 'uFadeRect', 'uHasBack', 'uGrade', 'uBright', 'uShimmer', 'uSeed']),
    lava: program(QUAD_VS, LAVA_FS, ['aP'], ['uSize', 'uDpr', 'uTime', 'uLava']),
    post: program(QUAD_VS, POST_FS, ['aP'], ['uScene', 'uSize', 'uDpr', 'uShimmer', 'uSeed', 'uGlow', 'uGlowA']),
  };

  // Drawing buffer: the screen at the device's resolution, within what a GPU handles easily
  const dpr = Math.min(window.devicePixelRatio || 1, 2, 2560 / W);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  function texture(source: TexImageSource | null, width = 1, height = 1): WebGLTexture | null {
    if (!gl) return null;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (source) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  // The content of the screen without the animated backgrounds, on transparent; the background of
  // the section on screen is read live from its own canvas at every frame
  const backdrop = (pageBackdrop(page).match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map((v) => Number(v) / 255);
  const contentTexture = texture(paintPage(page, H, Math.min(window.devicePixelRatio || 1, 2, 4096 / W), { skip: '.section-background', transparent: true }));
  const section = [...page.querySelectorAll<HTMLElement>('.section-background')].find((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < H && !!el.querySelector('canvas');
  });
  const liveCanvas = section?.querySelector('canvas') ?? null;
  const backRect = liveCanvas?.getBoundingClientRect();
  const fadeRect = section?.getBoundingClientRect();
  const backTexture = texture(null);
  let backReadable = !!liveCanvas;

  // The scene before the shimmer of the melt, drawn into a texture the size of the drawing buffer
  const sceneTexture = texture(null, canvas.width, canvas.height);
  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTexture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`framebuffer: ${status}`);

  // The strips: a grid each, its top row on the torn edge, its sides on the wavy cuts
  const data: number[] = [];
  const indices: number[] = [];
  strips.forEach((strip, s) => {
    const columns = strip.top.length - 1;
    const base = data.length / 4;
    strip.rows.forEach((y, r) => {
      const left = strip.left[r] ?? 0;
      const right = strip.right[r] ?? W;
      strip.top.forEach(([, dip], i) => {
        // 4 floats: rest position, dip of the top edge, strip
        data.push(left + ((right - left) * i) / columns, y, r === 0 ? dip : 0, s);
      });
    });
    for (let r = 0; r < strip.rows.length - 1; r += 1) {
      for (let i = 0; i < columns; i += 1) {
        const a = base + r * (columns + 1) + i;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  });
  if (data.length / 4 > 65535) throw new Error('too many vertices');
  const buffers = {
    strips: gl.createBuffer(), indices: gl.createBuffer(), quad: gl.createBuffer(),
  };
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.strips);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const stripValues = new Float32Array(MAX_STRIPS * 4);

  function quad(prog: Program) {
    if (!gl) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
    const at = prog.a.aP ?? -1;
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 8, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(at);
  }

  return {
    draw(t, list, look) {
      // A new shimmer pattern about 11 times a second
      const seed = Math.floor(t / 0.09) % 1000;
      // The live background, unless the browser refuses to share it
      if (backReadable && liveCanvas) {
        gl.bindTexture(gl.TEXTURE_2D, backTexture);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, liveCanvas);
        } catch {
          backReadable = false;
        }
      }
      // 1. Molten metal and strips, into the scene texture
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (look.lava > 0.002) {
        gl.useProgram(P.lava.pr);
        gl.uniform2f(P.lava.u.uSize ?? null, W, H);
        gl.uniform1f(P.lava.u.uDpr ?? null, dpr);
        gl.uniform1f(P.lava.u.uTime ?? null, t);
        gl.uniform1f(P.lava.u.uLava ?? null, look.lava);
        quad(P.lava);
      }
      const S = P.strips;
      gl.useProgram(S.pr);
      list.forEach((strip, i) => {
        stripValues.set([strip.gone ? 1e5 : strip.y, 1 + strip.y / strip.stretch, strip.dx, Math.tan((strip.lean * Math.PI) / 180) * strip.settle], i * 4);
      });
      gl.uniform4fv(S.u.uStrip ?? null, stripValues);
      gl.uniform2f(S.u.uView ?? null, W, H);
      gl.uniform2f(S.u.uSize ?? null, W, H);
      gl.uniform1f(S.u.uRagged ?? null, look.ragged);
      gl.uniform3f(S.u.uBackdrop ?? null, backdrop[0] ?? 0, backdrop[1] ?? 0, backdrop[2] ?? 0);
      gl.uniform1f(S.u.uHasBack ?? null, backReadable && backRect ? 1 : 0);
      if (backRect && fadeRect) {
        gl.uniform4f(S.u.uBackRect ?? null, backRect.left, backRect.top, backRect.width, backRect.height);
        gl.uniform4f(S.u.uFadeRect ?? null, fadeRect.left, fadeRect.top, fadeRect.width, fadeRect.height);
      }
      gl.uniformMatrix3fv(S.u.uGrade ?? null, false, look.grade);
      gl.uniform1f(S.u.uBright ?? null, look.bright);
      gl.uniform1f(S.u.uShimmer ?? null, look.shimmerContent);
      gl.uniform1f(S.u.uSeed ?? null, seed);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, contentTexture);
      gl.uniform1i(S.u.uContent ?? null, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, backTexture);
      gl.uniform1i(S.u.uBack ?? null, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.strips);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
      const attributes: [string, number, number][] = [['aRest', 2, 0], ['aDip', 1, 8], ['aStrip', 1, 12]];
      attributes.forEach(([name, size, offset]) => {
        const at = S.a[name] ?? -1;
        if (at < 0) return;
        gl.enableVertexAttribArray(at);
        gl.vertexAttribPointer(at, size, gl.FLOAT, false, 16, offset);
      });
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      attributes.forEach(([name]) => {
        const at = S.a[name] ?? -1;
        if (at >= 0) gl.disableVertexAttribArray(at);
      });
      // 2. The scene on screen, through the shimmer of the melt, with the glow
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(P.post.pr);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
      gl.uniform1i(P.post.u.uScene ?? null, 0);
      gl.uniform2f(P.post.u.uSize ?? null, W, H);
      gl.uniform1f(P.post.u.uDpr ?? null, dpr);
      gl.uniform1f(P.post.u.uShimmer ?? null, look.shimmerAll);
      gl.uniform1f(P.post.u.uSeed ?? null, seed);
      gl.uniform1f(P.post.u.uGlow ?? null, look.glow);
      gl.uniform1f(P.post.u.uGlowA ?? null, look.glowA);
      quad(P.post);
    },
    dispose() {
      Object.values(buffers).forEach((buffer) => gl.deleteBuffer(buffer));
      [contentTexture, backTexture, sceneTexture].forEach((tex) => gl.deleteTexture(tex));
      gl.deleteFramebuffer(frameBuffer);
      Object.values(P).forEach((prog) => gl.deleteProgram(prog.pr));
      // Frees the GPU now rather than whenever the canvas is collected
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
