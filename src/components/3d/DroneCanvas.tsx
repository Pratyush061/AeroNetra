/* eslint-disable react-hooks/purity */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// A geometric representation of a drone/point cloud for the background
function ParticleDrone() {
  const pointsRef = useRef<THREE.Points>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  // Create a stylized drone shape out of points
  const [positions, sizes, initialPositions] = useMemo(() => {
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

    return [pos, size, new Float32Array(pos)];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 for hover interaction
      targetRotation.current.x = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotation.current.y = (e.clientX / window.innerWidth) * 2 - 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Base rotation
      const baseRotationY = state.clock.elapsedTime * 0.1;

      // Calculate scroll factor (0 at top, 1 at full screen scroll)
      const scrollFactor = Math.min(scrollY.current / window.innerHeight, 1.5);

      // Interactive rotation (mouse hover + scroll transition)
      // When scrolling, the drone tilts back and rotates
      const targetRotY = baseRotationY + (targetRotation.current.y * 0.4) + (scrollFactor * Math.PI * 0.5);
      const targetRotX = (targetRotation.current.x * 0.4) + 0.2 - (scrollFactor * 0.8);

      // Smoothly interpolate current rotation to target
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, delta * 4);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, delta * 4);
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + scrollFactor * 0.3;

      // Dynamic Particle Dispersion (break apart effect on scroll)
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const currentPos = positionsAttr.array as Float32Array;

      // Breathing effect
      const time = state.clock.elapsedTime;
      const breathe = Math.sin(time * 2) * 0.02 + 1;

      // Explosion/Dispersion based on scroll
      const dispersion = 1 + scrollFactor * 1.5;

      for (let i = 0; i < currentPos.length; i += 3) {
         // Smoothly transition positions
         const targetX = initialPositions[i] * breathe * dispersion;
         const targetY = initialPositions[i+1] * breathe * dispersion;
         const targetZ = initialPositions[i+2] * breathe * dispersion;

         currentPos[i] = THREE.MathUtils.lerp(currentPos[i], targetX, delta * 5);
         currentPos[i+1] = THREE.MathUtils.lerp(currentPos[i+1], targetY, delta * 5);
         currentPos[i+2] = THREE.MathUtils.lerp(currentPos[i+2], targetZ, delta * 5);
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
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
          size={0.04}
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
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 5, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Optimize for mobile displays
      >
        <ambientLight intensity={0.5} />
        <ParticleDrone />
      </Canvas>
    </div>
  );
}
