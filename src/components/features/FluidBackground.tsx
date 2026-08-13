"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_intensity;
  uniform vec2 u_resolution;

  vec3 palette(float t) {
    vec3 a = vec3(0.05, 0.05, 0.09);
    vec3 b = vec3(0.32, 0.28, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.1, 0.2, 0.42);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.12;
    float wave1 = sin(uv.x * 1.6 + t) * cos(uv.y * 1.4 - t * 0.8);
    float wave2 = sin((uv.x + uv.y) * 1.2 - t * 0.6);
    float field = (wave1 * 0.6 + wave2 * 0.4) * u_intensity;

    float d = length(uv * vec2(1.0, 0.85)) - field * 0.6;
    vec3 color = palette(d + t * 0.3);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidPlane() {
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0.6 },
      u_resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const tween = gsap.to(uniforms.u_intensity, {
      value: 0.95,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [uniforms]);

  useFrame((state) => {
    uniforms.u_time.value = state.clock.elapsedTime;
    uniforms.u_resolution.value.set(viewport.width, viewport.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function FluidBackground() {
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-zinc-950">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        frameloop={prefersReducedMotion.current ? "demand" : "always"}
        camera={{ position: [0, 0, 1] }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
