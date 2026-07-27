import re

with open("src/components/3d/DroneCanvas.tsx", "r") as f:
    content = f.read()

# 1. Procedural Texture Generation
procedural_texture_code = """
import { useTexture } from "@react-three/drei";

function createEquirectangularTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Base fill: dark charcoal/navy
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine lat/long grid lines
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.15;

  // Latitudes
  for (let y = 0; y <= canvas.height; y += canvas.height / 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Longitudes
  for (let x = 0; x <= canvas.width; x += canvas.width / 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Sparse brighter dots scattered across the surface
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 500; i++) {
    const x = pseudoRandom(i * 3) * canvas.width;
    const y = pseudoRandom(i * 3 + 1) * canvas.height;
    const radius = pseudoRandom(i * 3 + 2) * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
"""

content = content.replace('import * as THREE from "three";', 'import * as THREE from "three";\n' + procedural_texture_code)
content = content.replace('import { Float } from "@react-three/drei";', 'import { Float } from "@react-three/drei";') # Already imported useTexture above

# Add uProgress and uTexture to shader uniforms
shader_material_uniforms = """
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffffff") },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uHoverState: { value: 0.0 }, // 0 to 1 smooth transition
      uProgress: { value: 0.0 }, // 0 = wrapped, 1 = unwrapped
      uTexture: { value: null }, // Equirectangular texture
    },
"""
content = re.sub(r'uniforms: \{[\s\S]*?\},', shader_material_uniforms.strip(), content)

# 2. Add attributes and shader logic for unwrap
shader_vertex = """
    vertexShader: `
      attribute float size;
      attribute vec2 uv_coord;
      attribute float pointIndexOffset;

      uniform vec3 uMouse;
      uniform float uHoverState;
      uniform float uTime;
      uniform float uProgress;

      varying float vDistance;
      varying float vIntensity;
      varying vec2 vUv;
      varying float vOpacity;

      void main() {
        vec3 pos = position;
        vUv = uv_coord;

        // Unwrap spiral logic
        // 1. Move outward along normal (which is just normalize(pos) for a sphere at origin)
        vec3 normal = normalize(pos);
        pos += normal * (uProgress * 15.0); // push outward

        // 2. Accumulate rotation around Y axis to form a spiral
        float rotationAmount = uProgress * pointIndexOffset * 0.005;
        float s_rot = sin(rotationAmount);
        float c_rot = cos(rotationAmount);

        float newX = pos.x * c_rot - pos.z * s_rot;
        float newZ = pos.x * s_rot + pos.z * c_rot;
        pos.x = newX;
        pos.z = newZ;

        // Mouse interaction logic (Dense Circle Repulsion)
        float distToMouse = distance(pos, uMouse);

        // Radius of effect (scaled relative to sphere radius, roughly 3.0 scale initially, but we keep 3.0)
        float effectRadius = 3.0;

        // Mouse interaction scales down as uProgress increases
        float activeHoverState = uHoverState * (1.0 - smoothstep(0.0, 0.3, uProgress));

        if (activeHoverState > 0.0 && distToMouse < effectRadius) {
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
          pos = mix(pos, targetPos, force * activeHoverState);

          // Increase intensity/brightness for particles in the ring
          vIntensity = pow(force * activeHoverState, 2.0); // Exponential intensity for premium glow
        } else {
          vIntensity = 0.0;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        // Slightly enlarge particles that are interacting
        float currentSize = size * (1.0 + vIntensity * 2.5);

        gl_PointSize = currentSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = -mvPosition.z;

        // Opacity fade based on progress
        vOpacity = 1.0 - smoothstep(0.5, 1.0, uProgress);
      }
    `,
"""
content = re.sub(r'vertexShader: `[\s\S]*?`,', shader_vertex.strip() + ',', content)

shader_fragment = """
    fragmentShader: `
      uniform vec3 uColor;
      uniform sampler2D uTexture;

      varying float vDistance;
      varying float vIntensity;
      varying vec2 vUv;
      varying float vOpacity;

      void main() {
        // Make particles perfectly round
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        if (distanceToCenter > 0.5) discard;

        // Smooth edge for anti-aliasing
        float alpha = smoothstep(0.5, 0.45, distanceToCenter);

        // Slight fade based on distance for depth
        float depthFade = smoothstep(20.0, 5.0, vDistance);

        // Sample texture
        vec4 texColor = texture2D(uTexture, vUv);

        // Mix texture color with base color / intensity
        vec3 finalColor = mix(texColor.rgb, vec3(1.0, 1.0, 1.0), vIntensity * 1.5);

        float finalAlpha = min(1.0, (alpha * depthFade * 0.9) + vIntensity * 1.2) * vOpacity;
        if (finalAlpha < 0.01) discard;

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `,
"""
content = re.sub(r'fragmentShader: `[\s\S]*?`,', shader_fragment.strip() + ',', content)

# 3. Create Fibonacci sphere geometry instead of drone
geometry_code = """
  // Create equirectangular texture
  const sphereTexture = useMemo(() => createEquirectangularTexture(), []);

  useEffect(() => {
    if (particleShaderMaterial) {
      particleShaderMaterial.uniforms.uTexture.value = sphereTexture;
    }
  }, [sphereTexture, particleShaderMaterial]);

  // Create a Fibonacci sphere
  const [positions, sizes, uvs, pointIndexOffsets] = useMemo(() => {
    const particleCount = 3000;
    const pos = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    const uv = new Float32Array(particleCount * 2);
    const pointIndexOffset = new Float32Array(particleCount);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const radius = 4.0; // Sphere radius

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const angle1 = Math.acos(1 - 2 * t);
      const angle2 = (2 * Math.PI * i) / goldenRatio;

      const x = radius * Math.sin(angle1) * Math.cos(angle2);
      const y = radius * Math.sin(angle1) * Math.sin(angle2);
      const z = radius * Math.cos(angle1);

      pos[i*3] = x;
      pos[i*3+1] = y;
      pos[i*3+2] = z;

      // Calculate UVs for equirectangular projection
      const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
      const v = 0.5 - Math.asin(y / radius) / Math.PI;
      uv[i*2] = u;
      uv[i*2+1] = v;

      size[i] = 0.05 + (pseudoRandom(i) * 0.04);
      pointIndexOffset[i] = i;
    }

    return [pos, size, uv, pointIndexOffset];
  }, []); // Run once on mount
"""
content = re.sub(r'const \[positions, sizes\] = useMemo\(\(\) => \{[\s\S]*?return \[pos, size\];\n  \}, \[\]\); \/\/ Run once on mount', geometry_code.strip(), content)

# 4. Attach new attributes in JSX
jsx_attributes = """
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
            attach="attributes-uv_coord"
            args={[uvs, 2]}
            count={uvs.length / 2}
            array={uvs}
            itemSize={2}
          />
          <bufferAttribute
            attach="attributes-pointIndexOffset"
            args={[pointIndexOffsets, 1]}
            count={pointIndexOffsets.length}
            array={pointIndexOffsets}
            itemSize={1}
          />
        </bufferGeometry>
"""
content = re.sub(r'<bufferGeometry>[\s\S]*?<\/bufferGeometry>', jsx_attributes.strip(), content)

# 5. Add scroll binding for uProgress
scroll_code = """
  const progressRef = useRef(0);
  useEffect(() => {
    // Find the hero section, it should be the parent wrapper.
    // Since this canvas is rendered inside the Hero section which takes min-h-screen,
    // we can use the closest section element or track scroll on document.
    let animationFrameId: number;
    let heroEl = document.querySelector('section');

    const handleScroll = () => {
      if (!heroEl) {
        heroEl = document.querySelector('section');
        if (!heroEl) return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      // Progress from 0 (top of hero at top of viewport) to 1 (hero scrolled completely out of view)
      // heroRect.top is 0 when hero is at top of screen.
      // heroRect.top is -heroRect.height when hero is completely scrolled up past the top.
      const progress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
      progressRef.current = progress;
    };

    const throttledScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    // Run once to initialize
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
"""

content = content.replace("const mouse3D = useRef(new THREE.Vector3(0, 0, 0));", scroll_code + "\n  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));")

useframe_update = """
      // Update shader uniform
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
        material.uniforms.uMouse.value.copy(mouse3D.current);
        material.uniforms.uHoverState.value = prefersReducedMotionRef.current ? 0.0 : currentHoverState.current;
        material.uniforms.uProgress.value = prefersReducedMotionRef.current ? 0.0 : progressRef.current;
      }
"""
content = re.sub(r'      // Update shader uniform[\s\S]*?uHoverState\.value = prefersReducedMotionRef\.current \? 0\.0 : currentHoverState\.current;\n      \}', useframe_update.strip(), content)

# Clean up CONFIG object since we don't need drone magic numbers anymore
clean_config = """
const CONFIG = {
  particleCount: 3000, // For the new globe
  effectRadius: 3.0,
};
"""
content = re.sub(r'const CONFIG = \{[\s\S]*?effectRadius: 3\.0,\n\};', clean_config.strip(), content)


with open("src/components/3d/DroneCanvas.tsx", "w") as f:
    f.write(content)
