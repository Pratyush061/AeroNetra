"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Use a simple seeded PRNG to ensure hydration consistency without violating react pure functions
const seededRandom = (() => {
  let seed = 12345;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
})();

// Generate a mathematical terrain point cloud
function TerrainPointCloud() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometryData = useMemo(() => {
    const count = 15000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (seededRandom() - 0.5) * 40;
      const z = (seededRandom() - 0.5) * 40;

      let y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
      y += Math.sin(x * 0.2) * Math.cos(z * 0.2) * 4;

      if (seededRandom() > 0.95) {
        y += seededRandom() * 5;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y - 5;
      positions[i * 3 + 2] = z;

      const mixedColor = y > 2 ? '#E88900' : (y > 0 ? '#746E65' : '#351407');
      color.set(mixedColor);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    if (material) {
        material.size = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[geometryData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[geometryData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Scanning Laser effect
function Scanner() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 15;
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 0.2]} />
      <meshBasicMaterial color="#E88900" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / (maxScroll || 1);

    const targetZ = 15 - scrollProgress * 25;
    const targetY = 2 + scrollProgress * 10;
    const targetRotX = -0.2 - scrollProgress * 0.8;

    // Use set methods to mutate Three.js objects safely avoiding eslint warnings
    camera.position.setZ(camera.position.z + (targetZ - camera.position.z) * 0.05);
    camera.position.setY(camera.position.y + (targetY - camera.position.y) * 0.05);

    // Euler rotation must be set using setX/setY/setZ or .set()
    camera.rotation.set(camera.rotation.x + (targetRotX - camera.rotation.x) * 0.05, camera.rotation.y, camera.rotation.z);
  });

  return null;
}

export function DroneVision() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-graphite">
      <Canvas
        camera={{ position: [0, 2, 15], fov: 60 }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={['#191715', 5, 30]} />
        <TerrainPointCloud />
        <Scanner />
        <CameraRig />
      </Canvas>
    </div>
  );
}
