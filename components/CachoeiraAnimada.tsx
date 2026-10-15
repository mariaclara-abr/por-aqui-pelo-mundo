"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Aquarela da cachoeira da tela de roteiro vazio, com água, névoa e árvores em movimento.
// A pintura (<Image>) fica por baixo e vale sozinha sem JS, sem WebGL ou com "reduzir movimento".
// Por cima, um canvas redesenha a mesma pintura a cada quadro e só mexe onde os mapas mandam
// (gerados por scripts/gerar-mascara-cachoeira.mjs):
//   mascara: R = queda d'água, G = lago, B = espuma
//   fluxo:   R = distância até a borda de onde a água cai, G = comprimento do fio d'água, B = balanço das copas
// ponytail: sem tratar perda de contexto WebGL; se acontecer, aparece só a aquarela estática.

const MASK_SRC = "/roteiro-cachoeira-mascara.png";
const FLOW_SRC = "/roteiro-cachoeira-fluxo.png";
const FRAME_MS = 15; // até 60 quadros por segundo, mesmo em telas de 120 Hz
// Mesmo enquadramento do <Image>; o canvas refaz essa conta no shader, sem depender de object-fit.
const FIT = "object-cover object-[65%_65%] lg:object-right";

const VERT = `
attribute vec2 aPos;
uniform vec2 uCanvas;
uniform vec2 uOff;
uniform vec2 uDisp;
varying vec2 vUv;
void main() {
  vec2 px = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5) * uCanvas;
  vUv = (px - uOff) / uDisp;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Comentarios do GLSL sem acento: alguns drivers recusam caracteres fora do ASCII.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uImg;
uniform sampler2D uMask;
uniform sampler2D uFlow;
uniform sampler2D uNoise;
uniform float uT;
varying vec2 vUv;

const vec2 SIZE = vec2(1536.0, 1024.0);

// Ruido de valor suave: cada texel da textura 256x256 cobre "cell" unidades de p.
float noise(vec2 p, vec2 cell) {
  vec2 x = p / cell;
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return texture2D(uNoise, (floor(x) + f + 0.5) / 256.0).r;
}

void main() {
  vec3 m = texture2D(uMask, vUv).rgb; // R queda, G lago, B espuma
  vec3 f = texture2D(uFlow, vUv).rgb; // R distancia da borda, G comprimento do fio, B vento
  vec2 p = vUv * SIZE;

  // A nevoa sobe da base da queda: procura espuma logo abaixo deste ponto.
  float halo = 0.0;
  if (p.x > 430.0 && p.x < 1470.0 && p.y > 470.0 && p.y < 770.0) {
    halo = max(texture2D(uMask, vUv + vec2(0.0, 26.0 / 1024.0)).b,
               texture2D(uMask, vUv + vec2(0.0, 58.0 / 1024.0)).b * 0.7);
  }
  if (m.r + m.g + m.b + f.b + halo < 0.004) {
    gl_FragColor = texture2D(uImg, vUv);
    return;
  }

  float k = 1.0 - exp(-uT * 0.8);              // o movimento entra devagar: o primeiro quadro e a propria pintura
  float te = uT - 1.0 + exp(-uT);              // tempo da agua: parte do repouso e chega a velocidade cheia em ~1 s
  vec2 uv = vUv;

  // Vento: a copa inteira balanca junto; rajadas lentas atravessam a cena da esquerda para a direita.
  if (f.b > 0.002) {
    float gust = 0.7 + 0.3 * sin(uT * 0.37 + 1.3) * sin(uT * 0.23);
    float wave = uT * 1.15 - p.x * 0.0042 + p.y * 0.0021;
    float sway = sin(wave) * 0.7 + sin(wave * 2.1 + 1.7) * 0.3;
    float flutter = noise(p - vec2(uT * 26.0, uT * 5.0), vec2(22.0)) - 0.5;
    float lift = noise(p + 40.0 - vec2(uT * 18.0, -uT * 9.0), vec2(26.0)) - 0.5;
    uv += f.b * gust * k * vec2(sway * 6.0 + flutter * 3.2, sway * 1.6 + lift * 2.2) / SIZE;
  }

  // Lago: ondas suaves que se afastam da queda em direcao a quem olha; perto do horizonte ficam menores e mais juntas.
  float lakeLight = 0.0;
  float crest = 0.0;
  if (m.g > 0.002) {
    float y0 = max(p.y - 700.0, 0.0);
    float yw = 180.0 * log(1.0 + y0 / 160.0);
    float depth = clamp(y0 / 320.0, 0.0, 1.0);
    float a1 = yw * 0.115 + p.x * 0.012 - uT * 2.3;
    float a2 = yw * 0.083 - p.x * 0.021 - uT * 1.7 + 1.3;
    float a3 = yw * 0.151 + p.x * 0.034 - uT * 3.0 + 2.1;
    float a4 = yw * 0.049 + p.x * 0.006 - uT * 1.1 + 4.0;
    float amp = mix(1.1, 2.6, depth);
    uv += m.g * k * vec2(sin(a2) * 0.8 + sin(a3) * 0.5, sin(a1) + sin(a3) * 0.5 + sin(a4) * 0.8) * amp / SIZE;
    // As cristas pegam luz: o brilho segue a inclinacao da onda, assim luz e movimento andam juntos.
    lakeLight = (cos(a1) * 0.5 + cos(a3) * 0.5) * 0.06 + (noise(p + vec2(uT * 18.0, uT * 10.0), vec2(52.0, 34.0)) - 0.5) * 0.12;
    crest = smoothstep(0.78, 0.98, cos(a1) * 0.6 + cos(a3) * 0.4)
          * smoothstep(0.4, 0.8, noise(p + 7.0 - vec2(uT * 14.0, 0.0), vec2(60.0, 26.0)));
  }

  vec3 col = texture2D(uImg, uv).rgb;

  // Queda: a propria pintura escorre pelo fio d'agua e acelera ao cair.
  // O ciclo e uma fita fechada com emenda em fade; a emenda desce junto com a agua, entao nao ha pulso.
  if (m.r > 0.002) {
    float d = f.r * 510.0;
    float len = f.g * 510.0;
    float lean = -0.52 + 0.15 * smoothstep(780.0, 900.0, p.x) + 0.1 * smoothstep(1270.0, 1330.0, p.x);
    vec2 dir = normalize(vec2(lean, 1.0));
    // A pintura desliza com aceleracao suave (raiz de d + 140); a fita comeca 14 px abaixo da borda e termina 6 px antes da espuma.
    float u = sqrt(d + 140.0);
    float u0 = 12.41;
    float u1 = sqrt(max(len - 6.0, 40.0) + 140.0);
    float seam = 1.0;
    float period = max(u1 - u0 - seam, 1.5);
    // A fase do tempo e igual em todo o espaco (so a posicao depende do comprimento do fio): com mod() direto, o periodo
    // que muda de ponto a ponto seria multiplicado pelo numero de ciclos ja passados e a agua viraria uma trama miuda.
    float q = period * fract((u - u0) / period - 1.65 * te);
    float uA = u0 + q;
    float uB = uA + period;
    vec2 from = uv - dir * (d - (uA * uA - 140.0)) / SIZE;
    vec2 fromB = uv - dir * (d - (uB * uB - 140.0)) / SIZE;
    float join = smoothstep(0.0, seam, q);
    vec3 flow = mix(texture2D(uImg, fromB).rgb, texture2D(uImg, from).rgb, join);
    float inside = smoothstep(0.5, 0.9, mix(texture2D(uMask, fromB).r, texture2D(uMask, from).r, join));
    float gate = smoothstep(8.0, 24.0, d) * (1.0 - smoothstep(len - 14.0, len - 2.0, d)) * smoothstep(90.0, 140.0, len) * (1.0 - m.b);
    col = mix(col, flow, m.r * gate * inside * k);
    // Fios claros e escuros descendo, alinhados com a inclinacao da queda, em duas velocidades.
    float c = p.x - lean * p.y;
    float uf = sqrt(d + 24.0);                         // os fios aceleram bem mais: esticam ao cair
    float fil = noise(vec2(c, uf - 8.8 * te), vec2(4.0, 2.2)) * 0.5
              + noise(vec2(c + 63.0, uf - 6.5 * te + 9.0), vec2(9.0, 3.6)) * 0.5;
    col *= 1.0 + m.r * k * (fil - 0.5) * 0.34;
  }

  // Espuma: manchas girando na base da queda.
  if (m.b > 0.002) {
    float foam = noise(p - vec2(uT * 18.0, -uT * 40.0), vec2(13.0, 9.0)) * 0.6
               + noise(p + 91.0 - vec2(-uT * 22.0, -uT * 30.0), vec2(24.0, 16.0)) * 0.4;
    col *= 1.0 + m.b * k * (foam - 0.5) * 0.36;
  }

  // Lago: luz nas cristas e brilhos curtos.
  col *= 1.0 + m.g * k * lakeLight;
  col += m.g * k * crest * 0.1;

  // Nevoa: sobe da base da queda e se desmancha no ar.
  if (halo > 0.002) {
    float mist = noise(p + vec2(uT * 6.0, uT * 22.0), vec2(46.0, 34.0))
               * noise(p + 17.0 + vec2(-uT * 9.0, uT * 14.0), vec2(80.0, 60.0));
    col = mix(col, vec3(0.97, 0.98, 0.96), halo * k * smoothstep(0.16, 0.5, mist) * 0.4);
  }

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader falhou");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader não compilou");
  }
  return shader;
}

function makeTexture(
  gl: WebGLRenderingContext,
  unit: number,
  wrap: number,
  upload: () => void,
) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  upload();
  return texture;
}

// Liga o canvas e devolve a função que desliga tudo. Lança se o navegador não der WebGL.
function animate(
  canvas: HTMLCanvasElement,
  painting: HTMLImageElement,
  mask: HTMLImageElement,
  flow: HTMLImageElement,
) {
  // Sem "alpha: false": o canvas nasce transparente e, se algo falhar, a aquarela de baixo continua visível.
  const gl = canvas.getContext("webgl", {
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL indisponível");

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "programa não ligou");
  }
  gl.useProgram(program);

  // Um retângulo cobrindo o canvas inteiro.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const noise = new Uint8Array(256 * 256);
  crypto.getRandomValues(noise);
  const upload = (image: HTMLImageElement) => () => {
    // Os mapas são dados, não cor: nada de conversão de perfil (a pintura usa a conversão normal).
    gl.pixelStorei(
      gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
      image === painting ? gl.BROWSER_DEFAULT_WEBGL : gl.NONE,
    );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  };
  const textures = [
    makeTexture(gl, 0, gl.CLAMP_TO_EDGE, upload(painting)),
    makeTexture(gl, 1, gl.CLAMP_TO_EDGE, upload(mask)),
    makeTexture(gl, 2, gl.CLAMP_TO_EDGE, upload(flow)),
    makeTexture(gl, 3, gl.REPEAT, () =>
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 256, 256, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, noise),
    ),
  ];
  ["uImg", "uMask", "uFlow", "uNoise"].forEach((name, unit) =>
    gl.uniform1i(gl.getUniformLocation(program, name), unit),
  );

  const time = gl.getUniformLocation(program, "uT");
  const uCanvas = gl.getUniformLocation(program, "uCanvas");
  const uOff = gl.getUniformLocation(program, "uOff");
  const uDisp = gl.getUniformLocation(program, "uDisp");
  let seconds = 0;
  const draw = () => {
    gl.uniform1f(time, seconds);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // Refaz a conta do object-fit: cover do <Image> (mesmo enquadramento e posição) em pixels do canvas.
  // O canvas nunca é mais fino que a própria pintura: em telas densas o navegador só amplia.
  const fit = () => {
    const [px, py] = getComputedStyle(painting)
      .objectPosition.split(" ")
      .map((v) => parseFloat(v) / 100);
    const cover = Math.max(
      canvas.clientWidth / painting.naturalWidth,
      canvas.clientHeight / painting.naturalHeight,
    );
    const scale = Math.min(window.devicePixelRatio || 1, 1 / cover);
    canvas.width = Math.round(canvas.clientWidth * scale);
    canvas.height = Math.round(canvas.clientHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const w = painting.naturalWidth * cover * scale;
    const h = painting.naturalHeight * cover * scale;
    gl.uniform2f(uCanvas, canvas.width, canvas.height);
    gl.uniform2f(uOff, (canvas.width - w) * (px || 0.5), (canvas.height - h) * (py || 0.5));
    gl.uniform2f(uDisp, w, h);
  };
  fit();

  let frameId = 0;
  const resizer = new ResizeObserver(() => {
    fit(); // mudar o tamanho limpa o canvas: redesenha já, para não piscar a aquarela estática
    draw();
  });
  resizer.observe(canvas);
  const dispose = () => {
    cancelAnimationFrame(frameId);
    resizer.disconnect();
    textures.forEach((texture) => gl.deleteTexture(texture));
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };

  // O primeiro quadro é a própria pintura. Se a GPU entregar preto, fica só a aquarela estática.
  draw();
  const pixel = new Uint8Array(4);
  gl.readPixels(canvas.width >> 1, canvas.height >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  if (pixel[0] + pixel[1] + pixel[2] === 0) {
    dispose();
    canvas.style.display = "none";
    throw new Error("a GPU devolveu um quadro preto");
  }

  canvas.style.opacity = "1"; // aparece num fade curto por cima da aquarela, sem salto

  let start = -1;
  let last = -FRAME_MS;
  const frame = (now: number) => {
    frameId = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    last = now;
    if (start < 0) start = now;
    // Dá a volta a cada 2 h: depois disso a precisão de float da GPU começaria a falhar.
    seconds = ((now - start) / 1000) % 7200;
    draw();
  };
  frameId = requestAnimationFrame(frame);
  return dispose;
}

export default function CachoeiraAnimada() {
  const paintingRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const painting = paintingRef.current;
    const canvas = canvasRef.current;
    if (!painting || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    const load = (src: string) => {
      const image = document.createElement("img");
      image.src = src;
      return image;
    };
    const mask = load(MASK_SRC);
    const flow = load(FLOW_SRC);
    Promise.all([painting.decode(), mask.decode(), flow.decode()])
      .then(() => {
        if (!cancelled) stop = animate(canvas, painting, mask, flow);
      })
      .catch((error) => {
        console.warn("Cachoeira animada indisponível, mantendo a aquarela estática:", error);
      });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <>
      <Image
        ref={paintingRef}
        src="/roteiro-cachoeira-aquarela.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 78vw, 100vw"
        loading="eager"
        className={FIT}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
      />
    </>
  );
}
