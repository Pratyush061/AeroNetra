/* eslint-disable react-hooks/purity */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Shader material to make particles sharp and perfectly round
const particleShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffffff") },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uHoverState: { value: 0.0 }, // 0 to 1 smooth transition
  },
  vertexShader: `
    attribute float size;

    uniform vec3 uMouse;
    uniform float uHoverState;
    uniform float uTime;

    varying float vDistance;
    varying float vIntensity;

    void main() {
      vec3 pos = position;

      // Mouse interaction logic (Dense Circle Repulsion)
      float distToMouse = distance(pos, uMouse);

      // Radius of effect
      float effectRadius = 3.0;

      if (uHoverState > 0.0 && distToMouse < effectRadius) {
        // Push outward from mouse to form a dense ring
        vec3 dir = normalize(pos - uMouse);

        // Target position on the edge of the circle
        vec3 targetPos = uMouse + dir * effectRadius;

        // Interpolate based on distance to mouse and hover state
        // Closer particles move more aggressively to the ring
        float force = pow(smoothstep(effectRadius, 0.0, distToMouse), 0.5);

        // Add a bit of rotation/swirl around the mouse
        float angle = uTime * 1.5;
        float s = sin(angle);
        float c = cos(angle);

        // Slight swirl effect on target pos
        targetPos.x = uMouse.x + (dir.x * c - dir.y * s) * effectRadius;
        targetPos.y = uMouse.y + (dir.x * s + dir.y * c) * effectRadius;

        // Blend between original and target position
        pos = mix(pos, targetPos, force * uHoverState);

        // Increase intensity/brightness for particles in the ring
        vIntensity = pow(force * uHoverState, 2.0); // Exponential intensity for premium glow
      } else {
        vIntensity = 0.0;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Slightly enlarge particles that are interacting
      float currentSize = size * (1.0 + vIntensity * 2.5);

      gl_PointSize = currentSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      vDistance = -mvPosition.z;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vDistance;
    varying float vIntensity;

    void main() {
      // Make particles perfectly round
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      if (distanceToCenter > 0.5) discard;

      // Smooth edge for anti-aliasing
      float alpha = smoothstep(0.5, 0.45, distanceToCenter);

      // Slight fade based on distance for depth
      float depthFade = smoothstep(20.0, 5.0, vDistance);

      // Increase brightness for particles gathered in the circle
      vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), vIntensity * 1.5); // Make dense ring brighter
      float finalAlpha = min(1.0, (alpha * depthFade * 0.9) + vIntensity * 1.2);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// A geometric representation of a drone/point cloud for the background
function ParticleDrone() {
  const pointsRef = useRef<THREE.Points>(null);
  const targetHoverState = useRef(0);
  const currentHoverState = useRef(0);
  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));

  // Create a stylized drone shape out of points, structured pattern
  const [positions, originalPos, sizes] = useMemo(() => {
    const particleCount = 2000; // Reduced count to ~50%
    const pos = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Core body (structured grid-like sphere)
      if (i < 500) {
        const phi = Math.acos(-1 + (2 * i) / 500);
        const theta = Math.sqrt(500 * Math.PI) * phi;

        const r = 1.2 + (Math.sin(theta * 5) * 0.1); // Add slight texture to surface

        pos[i*3] = r * Math.cos(theta) * Math.sin(phi);
        pos[i*3+1] = (r * Math.sin(theta) * Math.sin(phi)) * 0.3; // Flattened
        pos[i*3+2] = r * Math.cos(phi);
      }
      // Arms (structured lines)
      else if (i < 1400) {
        const armParticles = 900;
        const particlesPerArm = armParticles / 4;
        const armIndex = Math.floor((i - 500) / particlesPerArm);
        const progress = ((i - 500) % particlesPerArm) / particlesPerArm; // 0 to 1

        const length = 1.5 + (progress * 3.5); // Distribute evenly along arm length

        // Add a tight spiral or structure around the arm core
        const spiralAngle = progress * Math.PI * 10;
        const spiralRadius = 0.15 * (1 - progress * 0.5); // Tapering

        let x = 0, z = 0;
        if (armIndex === 0) { x = length; z = length; }
        if (armIndex === 1) { x = -length; z = length; }
        if (armIndex === 2) { x = length; z = -length; }
        if (armIndex === 3) { x = -length; z = -length; }

        pos[i*3] = x + (Math.cos(spiralAngle) * spiralRadius);
        pos[i*3+1] = (Math.sin(spiralAngle) * spiralRadius);
        pos[i*3+2] = z + (Math.sin(spiralAngle) * spiralRadius); // Slightly skewed for 3D depth
      }
      // Rotors (structured rings)
      else {
        const rotorParticles = 600;
        const particlesPerRotor = rotorParticles / 4;
        const rotorIndex = Math.floor((i - 1400) / particlesPerRotor);
        const progress = ((i - 1400) % particlesPerRotor) / particlesPerRotor; // 0 to 1

        // Create 3 concentric rings per rotor
        const ring = Math.floor(progress * 3);
        const ringProgress = (progress * 3) % 1;

        const radius = 0.5 + (ring * 0.4);
        const theta = ringProgress * 2 * Math.PI;

        let cx = 0, cz = 0;
        const dist = 4.5;
        if (rotorIndex === 0) { cx = dist; cz = dist; }
        if (rotorIndex === 1) { cx = -dist; cz = dist; }
        if (rotorIndex === 2) { cx = dist; cz = -dist; }
        if (rotorIndex === 3) { cx = -dist; cz = -dist; }

        pos[i*3] = cx + radius * Math.cos(theta);
        pos[i*3+1] = 0.2 + (ring * 0.05); // Slight height variation per ring
        pos[i*3+2] = cz + radius * Math.sin(theta);
      }

      size[i] = 0.04 + (Math.random() * 0.03); // Slightly larger and sharper
    }

    // Copy for original positions attribute
    const orig = new Float32Array(pos);

    return [pos, orig, size];
  }, []); // Run once on mount

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Base rotation
      pointsRef.current.rotation.y += delta * 0.2;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1 + 0.2;

      // Mouse interaction
      // Project mouse coordinates (-1 to +1) to 3D space on the drone's plane
      const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / dir.z; // Ray intersect with Z=0 plane
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

      // Transform world mouse pos into local space of the points object
      pointsRef.current.worldToLocal(pos);

      // Smoothly track mouse
      mouse3D.current.lerp(pos, 0.1);

      // Smoothly transition hover state (active if mouse is moved)
      // Check if mouse is near center (0,0) which usually happens when off-canvas initially
      const isMouseActive = Math.abs(state.pointer.x) > 0.01 || Math.abs(state.pointer.y) > 0.01;
      targetHoverState.current = isMouseActive ? 1.0 : 0.0;

      // Faster lerp in, slower lerp out for premium feel
      const lerpSpeed = targetHoverState.current > currentHoverState.current ? 0.15 : 0.05;
      currentHoverState.current += (targetHoverState.current - currentHoverState.current) * lerpSpeed;

      // Update shader uniform
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
        material.uniforms.uMouse.value.copy(mouse3D.current);
        material.uniforms.uHoverState.value = currentHoverState.current;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <points ref={pointsRef} material={particleShaderMaterial}>
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
        dpr={[1, 2]} // Support high-DPI (Retina) displays
      >
        <ambientLight intensity={0.5} />
        <ParticleDrone />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
