/* eslint-disable react-hooks/purity */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// A geometric representation of a drone/point cloud for the background
function ParticleDrone() {
  const pointsRef = useRef<THREE.Points>(null);

  // Create a stylized drone shape out of points
  const [positions, sizes] = useMemo(() => {
    const particleCount = 4000;
    const pos = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Core body (sphere-ish)
      if (i < 1000) {
        const r = 1.5 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.3; // Flattened
        pos[i*3+2] = r * Math.cos(phi);
      }
      // Arms (X shape)
      else if (i < 3000) {
        const armIndex = (i - 1000) % 4;
        const length = 1.5 + Math.random() * 3.5;
        const width = (Math.random() - 0.5) * 0.8;
        const height = (Math.random() - 0.5) * 0.4;

        let x = 0, z = 0;
        if (armIndex === 0) { x = length; z = length; }
        if (armIndex === 1) { x = -length; z = length; }
        if (armIndex === 2) { x = length; z = -length; }
        if (armIndex === 3) { x = -length; z = -length; }

        pos[i*3] = x + width;
        pos[i*3+1] = height;
        pos[i*3+2] = z + width;
      }
      // Rotors
      else {
        const rotorIndex = (i - 3000) % 4;
        const radius = Math.random() * 1.5;
        const theta = Math.random() * 2 * Math.PI;

        let cx = 0, cz = 0;
        const dist = 4.5;
        if (rotorIndex === 0) { cx = dist; cz = dist; }
        if (rotorIndex === 1) { cx = -dist; cz = dist; }
        if (rotorIndex === 2) { cx = dist; cz = -dist; }
        if (rotorIndex === 3) { cx = -dist; cz = -dist; }

        pos[i*3] = cx + radius * Math.cos(theta);
        pos[i*3+1] = 0.2 + (Math.random() - 0.5) * 0.2;
        pos[i*3+2] = cz + radius * Math.sin(theta);
      }

      size[i] = Math.random() * 1.5 + 0.5;
    }

    return [pos, size];
  }, []); // Run once on mount

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1 + 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <points ref={pointsRef}>
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
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </Float>
  );
}

export function DroneCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleDrone />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
