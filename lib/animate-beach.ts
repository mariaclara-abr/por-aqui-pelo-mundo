// Coordinates describe the original 1536 x 1024 watercolor, independently of its display size.
const VERTEX = `
attribute vec2 aPosition;
uniform vec2 uCrop;
uniform vec2 uCenter;
varying vec2 vUv;
void main() {
  vUv = (vec2(aPosition.x, -aPosition.y) * 0.5) * uCrop + uCenter;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uPainting;
uniform float uTime;
varying vec2 vUv;
const vec2 SIZE = vec2(1536.0, 1024.0);

float ellipse(vec2 p, vec2 center, vec2 radius) {
  return 1.0 - smoothstep(0.76, 1.0, length((p - center) / radius));
}
float trunk(vec2 p, vec2 a, vec2 b, float width) {
  vec2 d = b - a;
  float distance = length(p - a - d * clamp(dot(p - a, d) / dot(d, d), 0.0, 1.0));
  return smoothstep(width, width + 9.0, distance);
}
vec2 fronds(vec2 p, vec2 anchor, float phase) {
  float tip = smoothstep(20.0, 190.0, length(p - anchor));
  float wind = sin(uTime * 0.78 + phase) * 0.72 + sin(uTime * 1.31 + phase) * 0.28;
  float flutter = sin(uTime * 2.1 + p.x * 0.019 + p.y * 0.012 + phase);
  return tip * vec2(13.0 * wind + tip * flutter * 2.0, 3.0 * wind + tip * flutter);
}
void main() {
  vec2 p = vUv * SIZE;
  vec3 original = texture2D(uPainting, vUv).rgb;
  float fadeIn = smoothstep(0.0, 1.8, uTime);

  // Pigment gating leaves the blue sky and paper still, including between fronds.
  float leaf = smoothstep(0.0, 0.09, min(original.r, original.g) - original.b);
  float leftCrown = ellipse(p, vec2(754.0, 310.0), vec2(272.0, 230.0));
  float rightCrown = ellipse(p, vec2(1160.0, 185.0), vec2(300.0, 315.0));
  float rearCrown = ellipse(p, vec2(1460.0, 260.0), vec2(145.0, 155.0));
  float stillTrunks = trunk(p, vec2(730.0, 355.0), vec2(788.0, 535.0), 15.0)
    * trunk(p, vec2(1080.0, 208.0), vec2(1350.0, 660.0), 21.0)
    * trunk(p, vec2(1350.0, 260.0), vec2(1435.0, 615.0), 14.0);
  vec2 breeze = fronds(p, vec2(730.0, 355.0), 0.0) * leftCrown
    + fronds(p, vec2(1080.0, 208.0), 1.1) * rightCrown
    + fronds(p, vec2(1450.0, 300.0), 1.9) * rearCrown * 0.45;
  breeze /= max(1.0, leftCrown + rightCrown + rearCrown);

  // Waves travel shoreward; their amplitude falls to zero before reaching the horizon.
  float shore = 940.0 - 360.0 * smoothstep(250.0, 1500.0, p.x);
  float water = smoothstep(575.0, 610.0, p.y) * (1.0 - smoothstep(shore - 40.0, shore, p.y));
  water *= smoothstep(-0.025, 0.065, min(original.g, original.b) - original.r);
  water *= trunk(p, vec2(788.0, 535.0), vec2(865.0, 645.0), 20.0)
    * trunk(p, vec2(865.0, 645.0), vec2(980.0, 722.0), 24.0)
    * trunk(p, vec2(980.0, 722.0), vec2(1440.0, 855.0), 45.0);
  float depth = max(p.y - 565.0, 0.0);
  float wave = 18.0 * log(1.0 + depth / 80.0) + p.x * 0.003 - uTime * 0.9;
  vec2 ripple = vec2(sin(wave * 0.83 + 1.2) * 1.5,
    sin(wave) * 3.4 + sin(wave * 1.53 + 0.7) * 1.1);
  vec2 uv = vUv + fadeIn * (breeze * leaf * stillTrunks + ripple * water) / SIZE;
  gl_FragColor = texture2D(uPainting, uv);
}`;

export type BeachAnimation = { setRunning: (running: boolean) => void; dispose: () => void };

export function animateBeach(canvas: HTMLCanvasElement, painting: HTMLImageElement): BeachAnimation {
  const gl = canvas.getContext("webgl", { antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) throw new Error("WebGL indisponível");
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  const shaders: WebGLShader[] = [];
  let frame = 0;
  let running = false;
  let disposed = false;
  let observer: ResizeObserver | undefined;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    running = false;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    gl.useProgram(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };

  try {
    if (!program || !buffer || !texture) throw new Error("Recursos WebGL indisponíveis");
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader indisponível");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader da praia indisponível");
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, painting);
    gl.uniform1i(gl.getUniformLocation(program, "uPainting"), 0);
    const time = gl.getUniformLocation(program, "uTime");
    const crop = gl.getUniformLocation(program, "uCrop");
    const center = gl.getUniformLocation(program, "uCenter");
    let elapsed = 0;
    let previous = 0;
    const draw = () => {
      gl.uniform1f(time, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const cover = Math.max(width / painting.naturalWidth, height / painting.naturalHeight);
      const density = Math.min(window.devicePixelRatio || 1, 1.5, 1 / cover);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const cropX = width / (painting.naturalWidth * cover);
      const cropY = height / (painting.naturalHeight * cover);
      const [positionX, positionY] = getComputedStyle(painting).objectPosition.split(" ").map((value) => parseFloat(value) / 100);
      gl.uniform2f(crop, cropX, cropY);
      gl.uniform2f(center, 0.5 + (1 - cropX) * (positionX - 0.5), 0.5 + (1 - cropY) * (positionY - 0.5));
      draw();
    };
    resize();
    // Check allocations once, never stall the GPU in the animation loop.
    if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) throw new Error("Aquarela estática necessária");
    observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const tick = (now: number) => {
      if (!running || disposed || gl.isContextLost()) return;
      frame = requestAnimationFrame(tick);
      if (now - previous < 1000 / 30) return;
      elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      draw();
    };
    return {
      setRunning(next) {
        if (disposed || next === running) return;
        running = next;
        cancelAnimationFrame(frame);
        if (running) {
          previous = performance.now();
          frame = requestAnimationFrame(tick);
        }
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
