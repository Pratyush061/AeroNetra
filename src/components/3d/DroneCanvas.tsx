/* eslint-disable react-hooks/purity */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uScroll;

attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
  vColor = customColor;

  // Initial position
  vec3 pos = position;

  // --- Hover Interaction (Fluid dynamics simulation) ---
  // Convert mouse (from -1 to 1) to world space roughly
  vec3 mousePos = vec3(uMouse.x * 15.0, uMouse.y * 10.0, 0.0);

  // Calculate distance from particle to mouse
  float dist = distance(pos, mousePos);

  // Repulsion effect (push particles away if they are close)
  // Reduced interaction radius for subtlety
  float repulsionRadius = 1.8;
  float force = max(0.0, repulsionRadius - dist);

  // Smooth out the force with a quadratic easing
  force = force * force * 0.3; // Gentle curve, much lower intensity

  // Direction away from mouse
  vec3 dir = normalize(pos - mousePos);

  // Apply force, factoring in uMouseActive so particles smoothly return
  // to their origin when the mouse leaves or stops moving
  pos += dir * force * uMouseActive;

  // --- Scroll Dispersion ---
  // Expand outward based on scroll depth
  float dispersion = 1.0 + (uScroll * 2.0);
  pos *= dispersion;

  // Add some turbulence based on time and position
  pos.x += sin(uTime * 0.3 + pos.y) * 0.1 * uScroll;
  pos.y += cos(uTime * 0.2 + pos.x) * 0.1 * uScroll;
  pos.z += sin(uTime * 0.4 + pos.z) * 0.1 * uScroll;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Scale size based on distance to camera (perspective) and custom size attribute
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Create a soft circle instead of a square
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  // Soft edge glow, lowering overall alpha for visual balance
  float alpha = smoothstep(0.5, 0.1, dist);

  // Halved opacity so it doesn't overwhelm the text
  gl_FragColor = vec4(vColor, alpha * 0.4);
}
`;

function PremiumParticleSystem() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Points>(null);

  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const mouseActiveLerp = useRef(0);
  const scrollY = useRef(0);

  // Added a timeout to fade out interaction when mouse stops moving
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  const [positions, sizes, colors] = useMemo(() => {
    // Reduced particle count from 60k to 30k for a lighter, balanced feel
    const particleCount = 30000;
    const pos = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    const color = new Float32Array(particleCount * 3);

    // Core color palette matching the UI
    const colorA = new THREE.Color("#ffffff"); // Bright white
    const colorB = new THREE.Color("#a1a1aa"); // Metal/Zinc
    const colorC = new THREE.Color("#e4e4e7"); // Amber/Silver

    for (let i = 0; i < particleCount; i++) {
      // Core body (dense sphere) - 30% of particles
      if (i < particleCount * 0.3) {
        const r = 2.0 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.4;
        pos[i*3+2] = r * Math.cos(phi);
      }
      // Outer shell/cloud (sparse sphere) - 30% of particles
      else if (i < particleCount * 0.6) {
        const r = 2.0 + Math.random() * 3.0;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
      }
      // Structural details (drone-like geometry) - 40% of particles
      else {
        const structType = Math.random();
        if (structType < 0.5) {
          // X-arms
          const armIndex = Math.floor(Math.random() * 4);
          const length = Math.random() * 6.0;
          const spread = Math.random() * 0.4;

          let x = 0, z = 0;
          if (armIndex === 0) { x = length; z = length; }
          if (armIndex === 1) { x = -length; z = length; }
          if (armIndex === 2) { x = length; z = -length; }
          if (armIndex === 3) { x = -length; z = -length; }

          pos[i*3] = x + (Math.random() - 0.5) * spread;
          pos[i*3+1] = (Math.random() - 0.5) * 0.2;
          pos[i*3+2] = z + (Math.random() - 0.5) * spread;
        } else {
          // Rotors
          const rotorIndex = Math.floor(Math.random() * 4);
          const radius = Math.random() * 2.0;
          const theta = Math.random() * 2 * Math.PI;

          let cx = 0, cz = 0;
          const dist = 5.0;
          if (rotorIndex === 0) { cx = dist; cz = dist; }
          if (rotorIndex === 1) { cx = -dist; cz = dist; }
          if (rotorIndex === 2) { cx = dist; cz = -dist; }
          if (rotorIndex === 3) { cx = -dist; cz = -dist; }

          pos[i*3] = cx + radius * Math.cos(theta);
          pos[i*3+1] = 0.5 + (Math.random() - 0.5) * 0.1;
          pos[i*3+2] = cz + radius * Math.sin(theta);
        }
      }

      // Randomize sizes, keeping them relatively small for density
      size[i] = Math.random() * 0.08 + 0.02;

      // Assign colors based on position/type
      const mixedColor = colorA.clone().lerp(
        Math.random() > 0.5 ? colorB : colorC,
        Math.random()
      );

      color[i*3] = mixedColor.r;
      color[i*3+1] = mixedColor.g;
      color[i*3+2] = mixedColor.b;
    }

    return [pos, size, color];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseActive: { value: 0 },
    uScroll: { value: 0 }
  }), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      isHovering.current = true;
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      // Invert Y axis for WebGL
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        isHovering.current = false;
      }, 500); // Mouse idle for 500ms triggers return to origin
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  useFrame((state, delta) => {
    // Cap delta time to prevent massive jumps/fast rotations after tab switching
    const dt = Math.min(delta, 0.1);

    if (materialRef.current) {
      // Update time
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smoothly interpolate mouse position for fluid physics
      // Lower lerp factor (from 5 to 2.5) for gentler easing
      currentMouse.current.x = THREE.MathUtils.lerp(currentMouse.current.x, targetMouse.current.x, dt * 2.5);
      currentMouse.current.y = THREE.MathUtils.lerp(currentMouse.current.y, targetMouse.current.y, dt * 2.5);

      materialRef.current.uniforms.uMouse.value.set(currentMouse.current.x, currentMouse.current.y);

      // Smoothly fade mouse interaction in and out
      mouseActiveLerp.current = THREE.MathUtils.lerp(
        mouseActiveLerp.current,
        isHovering.current ? 1 : 0,
        dt * 3
      );
      materialRef.current.uniforms.uMouseActive.value = mouseActiveLerp.current;

      // Smoothly interpolate scroll factor
      const targetScroll = Math.min(scrollY.current / window.innerHeight, 1.5);
      materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScroll.value,
        targetScroll,
        dt * 3
      );
    }

    if (meshRef.current) {
      // Base rotation independent of shader
      const targetScroll = Math.min(scrollY.current / window.innerHeight, 1.5);

      const targetRotY = state.clock.elapsedTime * 0.05 + (targetMouse.current.x * 0.1 * mouseActiveLerp.current) + (targetScroll * Math.PI * 0.25);
      const targetRotX = (targetMouse.current.y * 0.1 * mouseActiveLerp.current) + 0.1 - (targetScroll * 0.5);

      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, dt * 1.5);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, dt * 1.5);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-customColor"
            args={[colors, 3]}
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </Float>
  );
}

export function DroneCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 14], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} // Antialias off for post-processing performance
        dpr={[1, 2]}
      >
        <PremiumParticleSystem />
        <EffectComposer>
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
