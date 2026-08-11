"use client";

import { useEffect, useRef, useState } from "react";

// ── The vertex shader ──────────────────────────────────────────
// Every fullscreen shader needs one. This one does almost nothing —
// it just draws one giant triangle that covers the whole screen,
// and passes screen position through to the fragment shader as
// v_uv (0,0 at one corner, 1,1 at the opposite corner).
const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// ── The fragment shader ────────────────────────────────────────
// This runs once per pixel, every frame. It decides what color
// that pixel is.
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion: stacks several "octaves" of the noise
// function above, each one smaller and quieter than the last. This
// is the standard technique for turning blotchy single-layer noise
// into something that reads as smooth, painterly cloud/aurora motion
// instead of patchy blobs.
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  uv.x *= u_resolution.x / u_resolution.y;

  vec2 mouse = u_mouse / u_resolution.y;
  mouse.x *= u_resolution.x / u_resolution.y;

  float distToMouse = length(uv - mouse);
  float pull = smoothstep(0.7, 0.0, distToMouse) * 0.2;

  // Slow-drifting fbm flow field, gently pulled toward the cursor.
  vec2 flow = uv * 1.8 + vec2(u_time * 0.04, u_time * 0.025);
  flow += normalize(mouse - uv + 0.0001) * pull;
  float n = fbm(flow);

  // Spectranet's real, verified brand blue: "Bay of Many" (#2B328B),
  // a blue-violet indigo — not a generic navy. Two shades of it give
  // depth without ever going pure black or reading too dark.
  vec3 bayDark = vec3(0.10, 0.12, 0.30);
  vec3 bayLight = vec3(0.22, 0.25, 0.62);
  vec3 orange = vec3(0.91, 0.36, 0.14);

  // Two-stage blend: dark shade eases into a lighter shade first
  // (adds depth without ever going pure black), then orange glows
  // through only the brighter parts of the flow — reads as light
  // emerging from the pattern, not a flat two-color gradient.
  vec3 color = mix(bayDark, bayLight, smoothstep(0.15, 0.55, n));
  color = mix(color, orange, smoothstep(0.45, 0.85, n));

  // Soft glow radiating from the cursor itself, on top of the flow —
  // this is what makes the mouse interaction feel alive rather than
  // just subtly bending the pattern.
  float glow = smoothstep(0.4, 0.0, distToMouse) * 0.4;
  color += orange * glow;

  outColor = vec4(color, 1.0);
}
`;

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // Reduced-motion users get a static CSS gradient instead (rendered
    // separately below) — the WebGL loop never even starts for them.
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    function compileShader(source: string, type: number) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    const vertShader = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fragShader = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // A single fullscreen triangle (covers the whole clip space,
    // cheaper than two triangles making a quad).
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      // Flip Y since screen coords go top-down, WebGL coords go bottom-up.
      mouseY = rect.height - (e.clientY - rect.top);
    }
    canvas.addEventListener("mousemove", handleMouseMove);

    function resize() {
      // Cap devicePixelRatio at 2 — going higher (some phones report 3+)
      // wastes GPU work with no visible benefit for a background effect.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas!.clientWidth * dpr;
      const height = canvas!.clientHeight * dpr;
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        gl!.viewport(0, 0, width, height);
      }
    }

    let animationId: number;
    let isVisible = true;

    // Pause the render loop entirely when the tab isn't visible —
    // no point burning battery/CPU animating something nobody sees.
    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible";
      if (isVisible) render(performance.now());
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    function render(time: number) {
      if (!isVisible) return;
      resize();
      gl!.uniform1f(timeLoc, time * 0.001);
      gl!.uniform2f(resolutionLoc, canvas!.width, canvas!.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

gl!.uniform2f(
  mouseLoc,
  mouseX * dpr,
  mouseY * dpr
);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // Static fallback: same palette, no motion, no WebGL at all.
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, #e85d24 0%, #2B328B 60%)",
        }}
      />
    );
  }

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />;
}