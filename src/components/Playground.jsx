import React, { useState, useCallback, useRef, useEffect } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a CSS hex color string → GLSL vec3 literal */
function hexToVec3(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return `vec3(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`;
}

/** Generate the full GLSL fragment shader string from settings */
/** Generate a complete, standalone BackgroundEffect.jsx component string */
function generateFullComponent(s) {
  const bajo = hexToVec3(s.colorBajo);
  const alto = hexToVec3(s.colorAlto);
  const escapedChars = (s.chars || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  return `import React, { useRef, useEffect } from "react";

/**
 * i:o ASCII Background Effect
 * Generated from Playground Settings
 */
export default function BackgroundEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // --- WebGL Setup ---
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const vertSrc = \`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    \`;

    const fragSrc = \`
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform sampler2D u_ascii;

      vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0))*289.0;}
      vec2 mod289(vec2 x){return x - floor(x * (1.0/289.0))*289.0;}
      vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.y = a0.y * x12.x + h.y * x12.y;
        g.z = a0.z * x12.z + h.z * x12.w;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        // Static parameters from Playground
        float waveFreq = ${s.waveFreq.toFixed(4)};
        float waveAmp  = ${s.waveAmp.toFixed(4)};
        float pixelSize = ${s.pixelSize.toFixed(1)};
        float noiseMultiplier = ${s.noiseMultiplier.toFixed(4)};
        float exponent = ${s.exponent.toFixed(4)};
        float totalChars = ${s.totalChars.toFixed(1)};
        float blurEffectVal = ${s.blurEffect.toFixed(4)};
        vec3 colorBajo = ${bajo};
        vec3 colorAlto = ${alto};

        vec2 distortion = vec2(
          snoise(uv * waveFreq + u_time * 0.1),
          snoise(uv * waveFreq - u_time * 0.1)
        ) * waveAmp;
        vec2 distortedPos = gl_FragCoord.xy + (distortion * u_resolution.xy);

        vec2 cell = floor(distortedPos / pixelSize);
        vec2 cellUV = cell * pixelSize / u_resolution.xy;

        vec2 scaledUV = vec2(cellUV.x * noiseMultiplier, cellUV.y * 2.0);
        float n = snoise(scaledUV + u_time * 0.10);
        n = pow((n + 1.0) * 0.5, exponent);

        float charIndex = floor(n * totalChars);
        charIndex = min(charIndex, totalChars - 1.0);

        vec2 localUV = mod(distortedPos, pixelSize) / pixelSize;
        float charWidth = 1.0 / totalChars;
        vec2 asciiUV = vec2(
          charIndex * charWidth + localUV.x * charWidth,
          localUV.y
        );

        vec3 baseColor = mix(colorBajo, colorAlto, n);
        float intensity = (n * blurEffectVal);
        
        float r = texture2D(u_ascii, asciiUV + vec2(intensity, 0.0)).r;
        float g = texture2D(u_ascii, asciiUV).g;
        float b = texture2D(u_ascii, asciiUV - vec2(intensity, 0.0)).b;
        
        float blur1 = texture2D(u_ascii, asciiUV + vec2(0.0, intensity)).g;
        float blur2 = texture2D(u_ascii, asciiUV - vec2(0.0, intensity)).g;
        
        vec3 asciiShape = vec3(r, g, b);
        float blurFactor = (blur1 + blur2) * 0.01;
        
        vec3 finalColor = mix(asciiShape, vec3(blurFactor), 0.3) * baseColor;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    \`;

    function compileShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
      return sh;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uAscii = gl.getUniformLocation(prog, "u_ascii");

    const startTime = Date.now();
    let animId;

    const initTexture = () => {
      const chars = "${escapedChars}";
      const fontSize = 64;
      const cc = document.createElement("canvas");
      const ctx = cc.getContext("2d");
      cc.width = fontSize * chars.length;
      cc.height = fontSize;
      ctx.font = "400 " + fontSize + "px 'Space Mono', monospace";
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], i * fontSize, 0);
      }

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cc);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.uniform1i(uAscii, 0);

      const render = () => {
        gl.uniform1f(uTime, (Date.now() - startTime) / 1000);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animId = requestAnimationFrame(render);
      };
      render();
    };

    // Load font from Google Fonts to ensure it works immediately
    const font = new FontFace("Space Mono", "url(/fonts/SpaceMono-Regular.woff2)");
    font.load().then(() => {
      document.fonts.add(font);
      initTexture();
    }).catch(() => initTexture());

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "black",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}
`;
}

// ─── Default & Random ───────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  pixelSize: 40,
  waveFreq: 0.9,
  waveAmp: 0.02,
  noiseMultiplier: 4.0,
  exponent: 1.4,
  totalChars: 5,
  chars: " .:oi",
  colorBajo: "#6600cc",
  colorAlto: "#f2f2f2",
  blurEffect: 0.016,
};

function vec3ToHex(r, g, b) {
  const toHex = (v) =>
    Math.round(Math.min(Math.max(v, 0), 1) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function randomHex() {
  return vec3ToHex(Math.random(), Math.random(), Math.random());
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function randomizeSettings(current) {
  const shuffleChars = (str) => {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  return {
    pixelSize: clamp(Math.round(Math.random() * 36 + 4), 4, 40),
    waveFreq: clamp(+(Math.random() * 3).toFixed(2), 0, 3),
    waveAmp: clamp(+(Math.random() * 0.1).toFixed(4), 0, 0.1),
    noiseMultiplier: clamp(+(Math.random() * 7.5 + 0.5).toFixed(2), 0.5, 8),
    exponent: clamp(+(Math.random() * 2.5 + 0.5).toFixed(2), 0.5, 3),
    totalChars: clamp(Math.round(Math.random() * 18 + 2), 2, 20),
    chars: shuffleChars(current.chars),
    colorBajo: randomHex(),
    colorAlto: randomHex(),
    blurEffect: clamp(+(Math.random() * 0.1).toFixed(4), 0, 0.1),
  };
}

// ─── WebGL Preview ──────────────────────────────────────────────────────────

function WebGLPreview({ settings }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const animRef = useRef(null);
  const uniformsRef = useRef({});
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    glRef.current = gl;

    // Función interna para ajustar el tamaño del buffer al tamaño del CSS
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // Solo actualizamos si el tamaño realmente cambió para ahorrar recursos
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    // Ejecutamos el primer ajuste
    resizeCanvas();

    const vertSrc = `attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}`;

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvas);

    function buildFragSrc() {
      return `precision mediump float;
uniform float u_time;uniform vec2 u_resolution;uniform sampler2D u_ascii;
uniform float u_pixelSize;uniform float u_waveFreq;uniform float u_waveAmp;
uniform float u_noiseMultiplier;uniform float u_exponent;uniform float u_totalChars;
uniform float u_blurEffect;uniform vec3 u_colorBajo;uniform vec3 u_colorAlto;
vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289v2(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289v3(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1;
  i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.y=a0.y*x12.x+h.y*x12.y;g.z=a0.z*x12.z+h.z*x12.w;
  return 130.0*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 distortion=vec2(snoise(uv*u_waveFreq+u_time*0.1),snoise(uv*u_waveFreq-u_time*0.1))*u_waveAmp;
  vec2 distortedPos=gl_FragCoord.xy+(distortion*u_resolution.xy);
  vec2 cell=floor(distortedPos/u_pixelSize);
  vec2 cellUV=cell*u_pixelSize/u_resolution.xy;
  vec2 scaledUV=vec2(cellUV.x*u_noiseMultiplier,cellUV.y*2.0);
  float n=snoise(scaledUV+u_time*0.10);
  n=pow((n+1.0)*0.5,u_exponent);
  float charIndex=floor(n*u_totalChars);
  charIndex=min(charIndex,u_totalChars-1.0);
  vec2 localUV=mod(distortedPos,u_pixelSize)/u_pixelSize;
  float charWidth=1.0/u_totalChars;
  vec2 asciiUV=vec2(charIndex*charWidth+localUV.x*charWidth,localUV.y);
  vec3 baseColor=mix(u_colorBajo,u_colorAlto,n);
  float intensity=(n*u_blurEffect);
  float r=texture2D(u_ascii,asciiUV+vec2(intensity,0.0)).r;
  float g=texture2D(u_ascii,asciiUV).g;
  float b=texture2D(u_ascii,asciiUV-vec2(intensity,0.0)).b;
  float blur1=texture2D(u_ascii,asciiUV+vec2(0.0,intensity)).g;
  float blur2=texture2D(u_ascii,asciiUV-vec2(0.0,intensity)).g;
  vec3 asciiShape=vec3(r,g,b);
  float blurEff=(blur1+blur2)*0.01;
  vec3 finalColor=mix(asciiShape,vec3(blurEff),0.3)*baseColor;
  gl_FragColor=vec4(finalColor,1.0);
}`;
    }

    function compileShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, buildFragSrc()));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    programRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      time: gl.getUniformLocation(prog, "u_time"),
      resolution: gl.getUniformLocation(prog, "u_resolution"),
      ascii: gl.getUniformLocation(prog, "u_ascii"),
      pixelSize: gl.getUniformLocation(prog, "u_pixelSize"),
      waveFreq: gl.getUniformLocation(prog, "u_waveFreq"),
      waveAmp: gl.getUniformLocation(prog, "u_waveAmp"),
      noiseMultiplier: gl.getUniformLocation(prog, "u_noiseMultiplier"),
      exponent: gl.getUniformLocation(prog, "u_exponent"),
      totalChars: gl.getUniformLocation(prog, "u_totalChars"),
      blurEffect: gl.getUniformLocation(prog, "u_blurEffect"),
      colorBajo: gl.getUniformLocation(prog, "u_colorBajo"),
      colorAlto: gl.getUniformLocation(prog, "u_colorAlto"),
    };

    function buildTexture(chars) {
      const fontSize = 64;
      const cc = document.createElement("canvas");
      const ctx = cc.getContext("2d");
      cc.width = fontSize * chars.length;
      cc.height = fontSize;
      ctx.font = `400 ${fontSize}px 'Space Mono', monospace`;
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], i * fontSize, 0);
      }
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cc);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.uniform1i(uniformsRef.current.ascii, 0);
      return tex;
    }

    function hexToFloat3(hex) {
      const h = hex.replace("#", "");
      return [
        parseInt(h.substring(0, 2), 16) / 255,
        parseInt(h.substring(2, 4), 16) / 255,
        parseInt(h.substring(4, 6), 16) / 255,
      ];
    }

    let currentTexChars = "";
    let texRef = null;
    const startTime = Date.now();

    const render = () => {
      const s = settingsRef.current;
      const u = uniformsRef.current;

      if (s.chars !== currentTexChars) {
        if (texRef) gl.deleteTexture(texRef);
        texRef = buildTexture(s.chars || " ");
        currentTexChars = s.chars;
      }

      const t = (Date.now() - startTime) / 1000;
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.pixelSize, s.pixelSize);
      gl.uniform1f(u.waveFreq, s.waveFreq);
      gl.uniform1f(u.waveAmp, s.waveAmp);
      gl.uniform1f(u.noiseMultiplier, s.noiseMultiplier);
      gl.uniform1f(u.exponent, s.exponent);
      gl.uniform1f(u.totalChars, s.totalChars);
      gl.uniform1f(u.blurEffect, s.blurEffect);
      const bajo = hexToFloat3(s.colorBajo);
      const alto = hexToFloat3(s.colorAlto);
      gl.uniform3f(u.colorBajo, ...bajo);
      gl.uniform3f(u.colorAlto, ...alto);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animRef.current = requestAnimationFrame(render);
    };

    const font = new FontFace(
      "Space Mono",
      "url(/i-o/fonts/SpaceMono-Regular.woff2)",
    );

    font
      .load()
      .then(() => {
        document.fonts.add(font);
        render();
      })
      .catch(() => {
        // Fallback to searching for the font in the document
        document.fonts.ready.then(() => render());
      });

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[560px] flex items-center justify-center bg-black">
      <h1 className="absolute z-10 pointer-events-none select-none text-white text-6xl font-bold font-mono tracking-tighter uppercase">
        Preview
      </h1>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

// ─── Control Helpers ─────────────────────────────────────────────────────────

function SliderRow({ label, id, value, min, max, step, onChange, display }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs text-neutral-400 tracking-wider uppercase font-mono"
        >
          {label}
        </label>
        <span className="text-xs text-neutral-300 font-mono bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
          {display ?? value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none cursor-pointer rounded-full bg-neutral-700 accent-neutral-400"
      />
    </div>
  );
}

function ColorRow({ label, id, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={id}
        className="text-xs text-neutral-400 tracking-wider uppercase font-mono"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 font-mono">
          {value.toUpperCase()}
        </span>
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-neutral-700 bg-neutral-800 p-0.5"
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function Playground({ className = "", onCopy, onCodeGenerate }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [copyLabel, setCopyLabel] = useState("Copy Code");

  useEffect(() => {
    if (onCodeGenerate) {
      onCodeGenerate(generateFullComponent(settings));
    }
  }, [settings, onCodeGenerate]);

  const set = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const handleRandomize = useCallback(() => {
    setSettings((prev) => randomizeSettings(prev));
  }, []);

  const handleCopy = useCallback(() => {
    const code = generateFullComponent(settings);
    navigator.clipboard.writeText(code).then(() => {
      setCopyLabel("Copied ✓");
      if (onCopy) onCopy();
      setTimeout(() => setCopyLabel("Copy Code"), 1500);
    });
  }, [settings, onCopy]);

  return (
    <section
      className={`min-h-screen w-full bg-neutral-900 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 60% 40%, rgba(80,40,160,0.07) 0%, transparent 60%), " +
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      }}
    >
      {/* Section Header */}
      <div className="px-6 pt-16 pb-8 max-w-7xl mx-auto">
        <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-2">
          Engine Lab
        </p>
        <h2 className="text-2xl font-semibold text-neutral-200 tracking-tight">
          Interactive Playground
        </h2>
        <p className="text-sm text-neutral-500 mt-1 font-mono">
          Tune shader parameters in real time. Copy the React component.
        </p>
      </div>

      {/* Main Grid */}
      <div className="px-6 pb-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* ── Controls Panel ── */}
        <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6 lg:sticky lg:top-24">
          {/* Geometry */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Geometry
            </h3>
            <SliderRow
              label="Pixel Size"
              id="pixelSize"
              value={settings.pixelSize}
              min={4}
              max={40}
              step={1}
              onChange={(v) => set("pixelSize", v)}
            />
          </div>

          {/* Wave */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Wave / Distortion
            </h3>
            <SliderRow
              label="Wave Freq"
              id="waveFreq"
              value={settings.waveFreq}
              min={0}
              max={3}
              step={0.01}
              display={settings.waveFreq.toFixed(2)}
              onChange={(v) => set("waveFreq", v)}
            />
            <SliderRow
              label="Wave Amp"
              id="waveAmp"
              value={settings.waveAmp}
              min={0}
              max={0.1}
              step={0.001}
              display={settings.waveAmp.toFixed(3)}
              onChange={(v) => set("waveAmp", v)}
            />
          </div>

          {/* Noise */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Noise Field
            </h3>
            <SliderRow
              label="Noise ×"
              id="noiseMultiplier"
              value={settings.noiseMultiplier}
              min={0.5}
              max={8}
              step={0.1}
              display={settings.noiseMultiplier.toFixed(1)}
              onChange={(v) => set("noiseMultiplier", v)}
            />
            <SliderRow
              label="Exponent"
              id="exponent"
              value={settings.exponent}
              min={0.5}
              max={3}
              step={0.05}
              display={settings.exponent.toFixed(2)}
              onChange={(v) => set("exponent", v)}
            />
          </div>

          {/* Characters */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Characters
            </h3>
            <SliderRow
              label="Total Chars"
              id="totalChars"
              value={settings.totalChars}
              min={2}
              max={20}
              step={1}
              onChange={(v) => set("totalChars", v)}
            />
            <div className="space-y-1.5">
              <label
                htmlFor="chars"
                className="text-xs text-neutral-400 tracking-wider uppercase font-mono"
              >
                Char Set
              </label>
              <input
                id="chars"
                type="text"
                value={settings.chars}
                onChange={(e) => set("chars", e.target.value)}
                maxLength={32}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-neutral-200 focus:outline-none focus:border-neutral-500 transition-colors"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Color Gradient
            </h3>
            <ColorRow
              label="Color Low"
              id="colorBajo"
              value={settings.colorBajo}
              onChange={(v) => set("colorBajo", v)}
            />
            <ColorRow
              label="Color High"
              id="colorAlto"
              value={settings.colorAlto}
              onChange={(v) => set("colorAlto", v)}
            />
          </div>

          {/* Aberration */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800 pb-2">
              Aberration
            </h3>
            <SliderRow
              label="Blur / Chrom"
              id="blurEffect"
              value={settings.blurEffect}
              min={0}
              max={0.1}
              step={0.001}
              display={settings.blurEffect.toFixed(3)}
              onChange={(v) => set("blurEffect", v)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 text-sm font-mono text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-neutral-200 rounded-lg py-2 transition-all duration-300"
            >
              ↺ Reset
            </button>
            <button
              onClick={handleRandomize}
              className="flex-1 text-sm font-mono text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-neutral-200 rounded-lg py-2 transition-all duration-300"
            >
              ⚄ Random
            </button>
          </div>
        </aside>

        {/* ── Live Preview ── */}
        <div
          className="relative rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950 flex flex-col lg:sticky lg:top-24"
          style={{
            minHeight: "560px",
            boxShadow:
              "0 0 60px rgba(100,50,200,0.06), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Glow ring */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              boxShadow: "inset 0 0 80px rgba(80,30,180,0.08)",
            }}
          />

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 z-10 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1 text-xs font-mono text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-all duration-300"
          >
            {copyLabel}
          </button>

          {/* Canvas */}
          <div className="flex-1 w-full h-full min-h-[560px]">
            <WebGLPreview settings={settings} />
          </div>

          {/* Bottom overlay with live stats */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center gap-4 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
              Live
            </span>
            <div className="flex gap-4 flex-wrap">
              {[
                ["px", settings.pixelSize],
                ["freq", settings.waveFreq.toFixed(2)],
                ["amp", settings.waveAmp.toFixed(3)],
                ["noise×", settings.noiseMultiplier.toFixed(1)],
                ["exp", settings.exponent.toFixed(2)],
                ["chars", settings.totalChars],
              ].map(([k, v]) => (
                <span
                  key={k}
                  className="text-[10px] font-mono text-neutral-500"
                >
                  {k}
                  <span className="text-neutral-300 ml-1">{v}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Playground;
