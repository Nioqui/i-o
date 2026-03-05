import { useEffect, useRef } from "react";

export default function BackgroundEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const initWebGL = () => {
      const canvas = canvasRef.current;
      const gl = canvas.getContext("webgl");
      if (!gl) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

      const fragmentShaderSource = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_ascii;

// --- SIMPLEX 2D ---
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
  m = m*m;
  m = m*m;
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

    // === 1. LIQUIFY (Distorsión de movimiento) ===
    float waveFreq = 0.9;
    float waveAmp = 0.02;
    vec2 distortion = vec2(
        snoise(uv * waveFreq + u_time * 0.1),
        snoise(uv * waveFreq - u_time * 0.1)
    ) * waveAmp;
    vec2 distortedPos = gl_FragCoord.xy + (distortion * u_resolution.xy);

    // === 2. CELDAS ASCII ===
    float pixelSize = 40.0;
    vec2 cell = floor(distortedPos / pixelSize);
    vec2 cellUV = cell * pixelSize / u_resolution.xy;

    // --- Ruido Simplex 2D ---
    vec2 scaledUV = vec2(cellUV.x * 4.0, cellUV.y * 2.0); // verticalidad
    float n = snoise(scaledUV + u_time * 0.10);
    n = pow((n + 1.0) * 0.5, 1.4); // normalizamos a 0-1 y ajustamos contraste

    float totalChars = 5.0;
    float charIndex = floor(n * totalChars);
    charIndex = min(charIndex, totalChars - 1.0);

    vec2 localUV = mod(distortedPos, pixelSize) / pixelSize;
    float charWidth = 1.0 / totalChars;
    vec2 asciiUV = vec2(
        charIndex * charWidth + localUV.x * charWidth,
        localUV.y
    );

    // === 3. DEGRADADO DE COLOR (Morado -> Blanco) ===
    vec3 colorBajo = vec3(0.4, 0.0, 0.8);
    vec3 colorAlto = vec3(1.2, 1.2, 1.2);
    vec3 baseColor = mix(colorBajo, colorAlto, n);

    // === 4. ABERRACIÓN CROMÁTICA + BLUR ===
    float intensity = (n * 0.016);

    float r = texture2D(u_ascii, asciiUV + vec2(intensity, 0.0)).r;
    float g = texture2D(u_ascii, asciiUV).g;
    float b = texture2D(u_ascii, asciiUV - vec2(intensity, 0.0)).b;

    float blur1 = texture2D(u_ascii, asciiUV + vec2(0.0, intensity)).g;
    float blur2 = texture2D(u_ascii, asciiUV - vec2(0.0, intensity)).g;

    vec3 asciiShape = vec3(r, g, b);
    float blurEffect = (blur1 + blur2) * 0.01;

    vec3 finalColor = mix(asciiShape, vec3(blurEffect), 0.3) * baseColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
    `;

      function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
          return null;
        }
        return shader;
      }

      const program = gl.createProgram();
      gl.attachShader(
        program,
        createShader(gl.VERTEX_SHADER, vertexShaderSource),
      );
      gl.attachShader(
        program,
        createShader(gl.FRAGMENT_SHADER, fragmentShaderSource),
      );
      gl.linkProgram(program);
      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const timeLoc = gl.getUniformLocation(program, "u_time");
      const resLoc = gl.getUniformLocation(program, "u_resolution");
      const asciiLoc = gl.getUniformLocation(program, "u_ascii");

      let animId;
      const startTime = Date.now();

      function drawTextureAndStart(fontFamily) {
        const chars = " .:oi";
        const fontSize = 64;
        const charCanvas = document.createElement("canvas");
        const charCtx = charCanvas.getContext("2d");
        charCanvas.width = fontSize * chars.length;
        charCanvas.height = fontSize;
        charCtx.font = `400 ${fontSize}px '${fontFamily}', monospace`;
        charCtx.fillStyle = "white";
        charCtx.textBaseline = "top";
        for (let i = 0; i < chars.length; i++) {
          charCtx.fillText(chars[i], i * fontSize, 0);
        }

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          charCanvas,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.uniform1i(asciiLoc, 0);

        const render = () => {
          gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
          gl.uniform2f(resLoc, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          animId = requestAnimationFrame(render);
        };
        render();
      }

      // Use document.fonts.ready to ensure Space Mono from Google Fonts is available
      document.fonts.ready
        .then(() => {
          drawTextureAndStart("Space Mono");
        })
        .catch(() => drawTextureAndStart("monospace"));

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      window.addEventListener("resize", handleResize);
    };

    const timer = setTimeout(() => {
      initWebGL();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        fontFamily: "Space Mono",
      }}
    />
  );
}
