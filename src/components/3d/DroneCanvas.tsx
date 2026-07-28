"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import * as THREE from "three";


/* ----------------------------- Utilities ---------------------------------- */

// Pre-allocated objects for useFrame
const _raySphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 6);
const _sphereHitTarget = new THREE.Vector3();
const _localVector = new THREE.Vector3();


// Deterministic PRNG (Mulberry32) — SSR/CSR safe
function makeRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------- Real continent land mask ---------------------------- */
// Continents defined as polygons in [latitude, longitude] pairs.
// Latitude: +90 (North Pole) to -90 (South Pole)
// Longitude: -180 to +180

// North America (Alaska → Central America)
const NORTH_AMERICA: [number, number][] = [
  [71, -168], [71, -140], [72, -100], [78, -75], [83, -50], [67, -50],
  [55, -55], [45, -60], [40, -73], [30, -80], [20, -75], [10, -84],
  [15, -95], [30, -115], [50, -125], [55, -135], [60, -150], [65, -168],
];

// Greenland
const GREENLAND: [number, number][] = [
  [83, -30], [78, -18], [70, -22], [60, -45], [72, -55], [80, -45], [83, -30],
];

// South America
const SOUTH_AMERICA: [number, number][] = [
  [12, -74], [11, -60], [5, -50], [-5, -35], [-15, -38], [-25, -40],
  [-35, -55], [-45, -65], [-55, -68], [-50, -75], [-30, -72], [-15, -75],
  [-5, -80], [5, -78], [12, -74],
];

// Eurasia (Europe + Asia as one landmass)
const EURASIA: [number, number][] = [
  [71, -10], [72, 30], [78, 60], [80, 100], [76, 140], [70, 170],
  [65, 178], [55, 165], [50, 140], [40, 130], [30, 122], [22, 112],
  [10, 105], [15, 95], [20, 88], [10, 80], [8, 78], [22, 68],
  [28, 55], [16, 50], [14, 43], [20, 33], [30, 32], [36, 27],
  [40, 15], [42, 0], [50, -5], [58, -10], [71, -10],
];

// Africa
const AFRICA: [number, number][] = [
  [35, -8], [37, 10], [33, 22], [30, 33], [15, 42], [10, 51],
  [-2, 42], [-15, 40], [-25, 35], [-34, 22], [-34, 18], [-25, 14],
  [-10, 8], [5, 0], [12, -8], [22, -15], [35, -8],
];

// Australia
const AUSTRALIA: [number, number][] = [
  [-12, 130], [-15, 142], [-22, 152], [-32, 152], [-38, 143],
  [-35, 130], [-32, 118], [-22, 113], [-15, 122], [-12, 130],
];

// Small island approximations (Indonesia, Japan, UK) as extra blobs
const ISLANDS: [number, number, number][] = [
  // Indonesia / Malay archipelago
  [-2, 110, 4], [-5, 120, 4], [0, 100, 3],
  // Japan
  [36, 138, 3], [42, 142, 2.5],
  // Philippines
  [12, 122, 2.5],
  // UK & Ireland
  [55, -3, 2.5],
  // Madagascar
  [-20, 47, 3],
  // New Zealand
  [-42, 172, 2.5], [-37, 175, 2.5],
  // Iceland
  [65, -18, 2],
];

function pointInPolygon(
  lat: number,
  lon: number,
  poly: [number, number][]
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const yi = poly[i][0], xi = poly[i][1];
    const yj = poly[j][0], xj = poly[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function createContinentMask() {
  const W = 360;
  const H = 180;
  const mask = new Uint8Array(W * H);
  const polys = [NORTH_AMERICA, GREENLAND, SOUTH_AMERICA, EURASIA, AFRICA, AUSTRALIA];

  for (let y = 0; y < H; y++) {
    const lat = 90 - (y / (H - 1)) * 180;
    for (let x = 0; x < W; x++) {
      const lon = -180 + (x / (W - 1)) * 360;
      let land = 0;

      // Antarctica: everything below -63° latitude
      if (lat < -63 + Math.sin(lon * 0.02) * 3) {
        land = 1;
      } else {
        for (const poly of polys) {
          if (pointInPolygon(lat, lon, poly)) {
            land = 1;
            break;
          }
        }
        if (!land) {
          // Islands as circular blobs
          for (const [ilat, ilon, r] of ISLANDS) {
            const dLat = lat - ilat;
            const dLon = lon - ilon;
            if (dLat * dLat + dLon * dLon < r * r) {
              land = 1;
              break;
            }
          }
        }
      }
      mask[y * W + x] = land;
    }
  }
  return { data: mask, width: W, height: H };
}

function sampleMask(
  mask: { data: Uint8Array; width: number; height: number },
  u: number,
  v: number
) {
  const x = Math.min(mask.width - 1, Math.max(0, Math.floor(u * mask.width)));
  const y = Math.min(mask.height - 1, Math.max(0, Math.floor(v * mask.height)));
  return mask.data[y * mask.width + x];
}

/* -------------------- Particle sampling (two layers) ---------------------- */

type ParticleArrays = {
  positions: Float32Array;
  aSize: Float32Array;
  aBrightness: Float32Array;
  aLatitude: Float32Array;
  aIndex: Float32Array;
  aLayer: Float32Array;
  count: number;
};

function buildParticles(isMobile: boolean): ParticleArrays {
  const mask = createContinentMask();
  const radius = 4.0;
  const rng = makeRng(20260728);

  const continentTarget = isMobile ? 900 : 2200;
  const gridTarget = isMobile ? 200 : 500;
  const total = continentTarget + gridTarget;

  const positions = new Float32Array(total * 3);
  const aSize = new Float32Array(total);
  const aBrightness = new Float32Array(total);
  const aLatitude = new Float32Array(total);
  const aIndex = new Float32Array(total);
  const aLayer = new Float32Array(total);

  let n = 0;

  // Layer A: continent dots via rejection sampling on the sphere
  let attempts = 0;
  const maxAttempts = continentTarget * 60;
  while (n < continentTarget && attempts < maxAttempts) {
    attempts++;
    // y is vertical/pole axis; x,z lie on equatorial plane
    const y = 1 - 2 * rng();
    const t = 2 * Math.PI * rng();
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const x = r * Math.cos(t);
    const z = r * Math.sin(t);
    const lat = Math.asin(y);
    const lon = Math.atan2(z, x);
    const u = 0.5 + lon / (2 * Math.PI);
    const v = 0.5 - lat / Math.PI;
    if (sampleMask(mask, u, v) === 0) continue;

    positions[n * 3 + 0] = x * radius;
    positions[n * 3 + 1] = y * radius;
    positions[n * 3 + 2] = z * radius;
    aSize[n] = 0.09 + rng() * 0.05;
    aBrightness[n] = 0.85 + rng() * 0.35;
    aLatitude[n] = y;
    aIndex[n] = n;
    aLayer[n] = 0;
    n++;
  }
  while (n < continentTarget) {
    const y = 1 - 2 * rng();
    const t = 2 * Math.PI * rng();
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const x = r * Math.cos(t);
    const z = r * Math.sin(t);
    positions[n * 3 + 0] = x * radius;
    positions[n * 3 + 1] = y * radius;
    positions[n * 3 + 2] = z * radius;
    aSize[n] = 0.025 + rng() * 0.015;
    aBrightness[n] = 0.08 + rng() * 0.05;
    aLatitude[n] = y;
    aIndex[n] = n;
    aLayer[n] = 0;
    n++;
  }

  // Layer B: sparse lat/long grid outline
  const latRings = 9;
  const lonMeridians = 18;
  const perRingBase = Math.floor(gridTarget / (latRings + lonMeridians));

  for (let i = 1; i <= latRings; i++) {
    const v = i / (latRings + 1);
    const lat = (v - 0.5) * Math.PI;
    const cy = Math.sin(lat);
    const cr = Math.cos(lat);
    const per = Math.max(6, Math.floor(perRingBase * (0.4 + cr)));
    for (let k = 0; k < per && n < total; k++) {
      const a = (k / per) * Math.PI * 2 + rng() * 0.02;
      const x = cr * Math.cos(a);
      const z = cr * Math.sin(a);
      positions[n * 3 + 0] = x * radius;
      positions[n * 3 + 1] = cy * radius;
      positions[n * 3 + 2] = z * radius;
      aSize[n] = 0.04 + rng() * 0.02;
      aBrightness[n] = 0.4 + rng() * 0.15;
      aLatitude[n] = cy;
      aIndex[n] = n;
      aLayer[n] = 1;
      n++;
    }
  }

  for (let j = 0; j < lonMeridians && n < total; j++) {
    const lon = (j / lonMeridians) * Math.PI * 2;
    const cosL = Math.cos(lon);
    const sinL = Math.sin(lon);
    const per = Math.max(6, perRingBase);
    for (let k = 0; k < per && n < total; k++) {
      const a = (k / per) * Math.PI - Math.PI / 2 + rng() * 0.02;
      const cy = Math.sin(a);
      const cr = Math.cos(a);
      const x = cr * cosL;
      const z = cr * sinL;
      positions[n * 3 + 0] = x * radius;
      positions[n * 3 + 1] = cy * radius;
      positions[n * 3 + 2] = z * radius;
      aSize[n] = 0.04 + rng() * 0.02;
      aBrightness[n] = 0.35 + rng() * 0.15;
      aLatitude[n] = cy;
      aIndex[n] = n;
      aLayer[n] = 1;
      n++;
    }
  }

  // Create fresh properly-sized typed arrays
  const posOut = new Float32Array(n * 3);
  const sizeOut = new Float32Array(n);
  const brightOut = new Float32Array(n);
  const latOut = new Float32Array(n);
  const idxOut = new Float32Array(n);
  const layerOut = new Float32Array(n);
  
  posOut.set(positions.subarray(0, n * 3));
  sizeOut.set(aSize.subarray(0, n));
  brightOut.set(aBrightness.subarray(0, n));
  latOut.set(aLatitude.subarray(0, n));
  idxOut.set(aIndex.subarray(0, n));
  layerOut.set(aLayer.subarray(0, n));
  
  return {
    positions: posOut,
    aSize: sizeOut,
    aBrightness: brightOut,
    aLatitude: latOut,
    aIndex: idxOut,
    aLayer: layerOut,
    count: n,
  };
}

/* -------------------------- Atmosphere glow ------------------------------- */

function AtmosphereGlow({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: 1.0 },
          uColor: { value: new THREE.Color("#60a5fa") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(uColor, clamp(intensity, 0.0, 1.0) * 0.35 * uOpacity);
          }
        `,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current;
    const scale = 1 + p * 0.35;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uOpacity.value =
      Math.max(0, 1 - p * 1.1);
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[4.25, 48, 48]} />
    </mesh>
  );
}

/* --------------------------- Particle globe ------------------------------- */

function ParticleGlobe() {
  useThree();

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const particles = useMemo(() => buildParticles(isMobile), [isMobile]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAccent: { value: new THREE.Color("#7dd3fc") },
          uContinent: { value: new THREE.Color("#e2e8f0") },
          uGrid: { value: new THREE.Color("#3b82f6") },
          uMouse: { value: new THREE.Vector3(999, 999, 999) },
          uHover: { value: 0 },
          uProgress: { value: 0 },
          uPixelRatio: {
            value: Math.min(
              2,
              typeof window !== "undefined" ? window.devicePixelRatio : 1
            ),
          },
        },
        vertexShader: /* glsl */ `
          attribute float aSize;
          attribute float aBrightness;
          attribute float aLatitude;
          attribute float aIndex;
          attribute float aLayer;

          uniform float uTime;
          uniform float uProgress;
          uniform float uPixelRatio;
          uniform vec3 uMouse;
          uniform float uHover;

          varying float vBrightness;
          varying float vLayer;
          varying float vIntensity;
          varying float vProximity;
          varying float vOpacity;

          void main() {
            vec3 pos = position;
            vec3 nrm = normalize(pos);

            // Latitude-staggered peel: poles first, equator last
            float latAbs = abs(aLatitude);
            float delayStart = mix(0.4, 0.0, latAbs);
            float span = 0.55;
            float local = clamp((uProgress - delayStart) / span, 0.0, 1.0);
            float eased = local * local * (3.0 - 2.0 * local);

            if (eased > 0.0001) {
              // ---- Alive ribbon streams (Stripe/Linear-style flowing bands) ----

              // Assign each particle to one of several horizontal bands.
              // Golden-ratio hashing keeps distribution even without banding artefacts.
              float bandCount = 6.0;
              float bandHash = fract(aIndex * 0.61803398);
              float bandId = floor(bandHash * bandCount);
              float bandT = bandId / (bandCount - 1.0);            // 0..1
              float bandY = mix(-4.2, 4.2, bandT);                 // vertical band center

              // Position within band: spread particles across a wide horizontal range.
              // Camera z=14, fov=40 → viewport ~10 world units wide, so ±13 lets
              // ribbons stream in from off-screen and exit for depth.
              float slot = fract(aIndex * 0.271);                  // 0..1 per particle
              float baseX = mix(-13.0, 13.0, slot);

              // Time-driven horizontal flow; alternate direction per band for
              // intersecting-river feel, each band gets its own speed & phase.
              float bandSpeed = 0.35 + bandHash * 0.6;             // 0.35..0.95
              float bandDir = mod(bandId, 2.0) < 0.5 ? 1.0 : -1.0;
              float flow = uTime * bandSpeed * bandDir + bandId * 1.9;
              float xR = mod(baseX + flow + 13.0, 26.0) - 13.0;

              // Multi-frequency sway → alive/organic (fake fBm)
              float phase = xR * 0.32 + bandId * 1.7 + uTime * 0.45;
              float sway = sin(phase) * 1.15
                         + sin(phase * 2.3 + bandId * 0.8) * 0.55
                         + sin(phase * 0.55 - uTime * 0.28) * 0.75;

              // Cross-band gentle vertical drift so all bands breathe together
              float breathe = sin(uTime * 0.35 + bandT * 3.14159) * 0.35;

              float yR = bandY + sway + breathe;

              // Depth wobble for parallax & premium feel
              float zR = sin(phase * 0.62 + bandId * 2.1) * 1.6
                       + cos(phase * 1.15 + uTime * 0.3) * 0.9;

              // Ribbon thickness — thin vertical scatter within each band
              float thick = fract(aIndex * 0.111) - 0.5;
              yR += thick * 0.55;
              zR += thick * 0.4;

              // Per-particle turbulence (small, high-frequency)
              xR += sin(aIndex * 0.37 + uTime * 1.4) * 0.18;
              yR += cos(aIndex * 0.29 + uTime * 1.1) * 0.14;

              // Custom smoother ease for transition from globe to ribbons
              float blendE = eased * eased * eased * (eased * (eased * 6.0 - 15.0) + 10.0); // Smootherstep
              // Add a bit of spiral motion during the transition
              float spiralSpin = blendE * 3.14159 * 1.5;
              float cx = cos(spiralSpin);
              float sz = sin(spiralSpin);
              float rotX = pos.x * cx - pos.z * sz;
              float rotZ = pos.x * sz + pos.z * cx;
              vec3 spiraledPos = vec3(rotX, pos.y, rotZ);

              pos = mix(spiraledPos, vec3(xR, yR, zR), blendE);
            }

            float hoverActive = uHover * (1.0 - smoothstep(0.0, 0.35, uProgress));
            float d = distance(pos, uMouse);
            float radius = 1.6;
            vProximity = 0.0;
            vIntensity = 0.0;
            if (hoverActive > 0.01 && d < radius) {
              float f = pow(smoothstep(radius, 0.0, d), 0.75);
              vProximity = f * hoverActive;
              vIntensity = pow(vProximity, 1.4) * (0.75 + 0.25 * sin(uTime * 3.0 + aIndex * 0.11));
            }

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float sizePx = aSize * (1.0 + vIntensity * 2.0);
            gl_PointSize = sizePx * (450.0 / -mv.z) * uPixelRatio;
            gl_Position = projectionMatrix * mv;

            vBrightness = aBrightness;
            vLayer = aLayer;
            // Keep the helix visible — dots stay bright until near end of range
            vOpacity = 1.0;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uAccent;
          uniform vec3 uContinent;
          uniform vec3 uGrid;

          varying float vBrightness;
          varying float vLayer;
          varying float vIntensity;
          varying float vProximity;
          varying float vOpacity;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;

            // Crisp round dot with subtle soft edge
            float core = smoothstep(0.5, 0.38, d);
            float softEdge = smoothstep(0.5, 0.25, d) * 0.15;

            vec3 base = mix(uContinent, uGrid, vLayer);
            base *= vBrightness;

            // Subtle center brightness for 3D depth illusion
            float centerGlow = smoothstep(0.4, 0.0, d) * 0.3;
            base += centerGlow;

            vec3 hoverCol = mix(vec3(1.0), uAccent, 0.55);
            vec3 col = mix(base, hoverCol, vProximity * 0.9);

            float alpha = core + softEdge * (1.0 + vIntensity * 3.0);
            alpha *= vOpacity;
            alpha += vIntensity * 0.6;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  /* ---------------------- Refs for interaction/state ---------------------- */

  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const isDragging = useRef(false);
  const dragRotation = useRef({ x: 0.2, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const prevPointer = useRef({ x: 0, y: 0 });

  const parallaxTarget = useRef({ x: 0, y: 0 });
  const parallaxCurrent = useRef({ x: 0, y: 0 });

  const hoverTarget = useRef(0);
  const hoverCurrent = useRef(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);

  const mouseLocal = useRef(new THREE.Vector3(999, 999, 999));
  const raycaster = useRef(new THREE.Raycaster());
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const hitPoint = useRef(new THREE.Vector3());

  const prefersReducedMotion = useRef(false);

  /* --------------------------- Global listeners --------------------------- */

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      hoverTarget.current = 1;
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => {
        hoverTarget.current = 0;
      }, 2500);

      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      parallaxTarget.current.x = ny * 0.12;
      parallaxTarget.current.y = nx * 0.18;
    };
    window.addEventListener("pointermove", onPointerMove);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const onMq = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onMq);

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        // Adjust the spread to make detachment more elegant and gradual (0% to 100% of hero section height)
        // Let's map it across a longer scroll distance for smoother visual transition
        // The hero is typically 100vh. A slow transition from 5% to 90% is much smoother.
        const scrollRatio = window.scrollY / Math.max(1, window.innerHeight);
        const p = Math.max(0, Math.min(1, (scrollRatio - 0.05) / 0.85));
        rawProgress.current = p;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onWindowPointerUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      mq.removeEventListener("change", onMq);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  /* --------------------------- Drag handlers ------------------------------ */

  const onDragDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = { x: 0, y: 0 };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - prevPointer.current.x) * 0.006;
    const dy = (e.clientY - prevPointer.current.y) * 0.006;
    dragVelocity.current.x = dy;
    dragVelocity.current.y = dx;
    dragRotation.current.x = THREE.MathUtils.clamp(
      dragRotation.current.x + dy,
      -1.1,
      1.1
    );
    dragRotation.current.y += dx;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onDragUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  /* ------------------------------- Frame ---------------------------------- */

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current) return;

    const target = prefersReducedMotion.current ? 0 : rawProgress.current;
    // Fast follow on scroll down, slightly slower reassembly on scroll up
    const followRate = target > smoothProgress.current
      ? 1 - Math.pow(0.0001, delta * 8)
      : 1 - Math.pow(0.0005, delta * 7);
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      target,
      followRate
    );
    const p = smoothProgress.current;

    if (!prefersReducedMotion.current) {
      if (!isDragging.current) {
        dragVelocity.current.x *= 0.94;
        dragVelocity.current.y *= 0.94;
        dragRotation.current.x = THREE.MathUtils.clamp(
          dragRotation.current.x + dragVelocity.current.x,
          -1.1,
          1.1
        );
        dragRotation.current.y += dragVelocity.current.y;

        const autoSpeed = 0.11 * (1 - p * 0.75);
        dragRotation.current.y += delta * autoSpeed;
      }

      // Extra spin during scroll for "spiralling off" feel
      dragRotation.current.y += delta * (0.55 * p);

      const parallaxWeight = isDragging.current ? 0.15 : 1.0;
      parallaxCurrent.current.x = THREE.MathUtils.lerp(
        parallaxCurrent.current.x,
        parallaxTarget.current.x * parallaxWeight,
        0.06
      );
      parallaxCurrent.current.y = THREE.MathUtils.lerp(
        parallaxCurrent.current.y,
        parallaxTarget.current.y * parallaxWeight,
        0.06
      );
    }

    const scrollTiltZ = p * 0.42;
    groupRef.current.rotation.x =
      dragRotation.current.x + parallaxCurrent.current.x + p * 0.18;
    groupRef.current.rotation.y =
      dragRotation.current.y + parallaxCurrent.current.y;
    groupRef.current.rotation.z = scrollTiltZ;

    raycaster.current.setFromCamera(state.pointer, state.camera);
    
    // Raycast to a virtual sphere around the globe (radius 6) for better lower-hemisphere interaction
    _raySphere.center.set(0, 0, 0);
    _raySphere.radius = 6;
    const sphereHit = raycaster.current.ray.intersectSphere(_raySphere, _sphereHitTarget);
    
    // Use sphere intersection if valid, otherwise fall back to plane
    if (sphereHit !== null) {
      hitPoint.current.copy(sphereHit);
    } else {
      raycaster.current.ray.intersectPlane(dragPlane.current, hitPoint.current);
    }
    
    _localVector.copy(hitPoint.current);
    groupRef.current.worldToLocal(_localVector);
    
    // Clamp mouse position to prevent shader artifacts from extreme values
    const maxDist = 8;
    if (_localVector.length() > maxDist) {
      _localVector.normalize().multiplyScalar(maxDist);
    }
    
    mouseLocal.current.lerp(_localVector, 0.12);

    const to = hoverTarget.current;
    const rate = to > hoverCurrent.current ? 0.12 : 0.03;
    hoverCurrent.current += (to - hoverCurrent.current) * rate;

    const u = (pointsRef.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.copy(mouseLocal.current);
    u.uHover.value = prefersReducedMotion.current ? 0 : hoverCurrent.current;
    u.uProgress.value = p;
  });

  /* ------------------------------- JSX ------------------------------------ */

  const { positions, aSize, aBrightness, aLatitude, aIndex, aLayer } =
    particles;

  // Manually create buffer attributes to ensure proper initialization
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
    geom.setAttribute("aBrightness", new THREE.BufferAttribute(aBrightness, 1));
    geom.setAttribute("aLatitude", new THREE.BufferAttribute(aLatitude, 1));
    geom.setAttribute("aIndex", new THREE.BufferAttribute(aIndex, 1));
    geom.setAttribute("aLayer", new THREE.BufferAttribute(aLayer, 1));
    return geom;
  }, [positions, aSize, aBrightness, aLatitude, aIndex, aLayer]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group
      ref={groupRef}
      scale={isMobile ? 0.75 : 1}
      onPointerDown={onDragDown}
      onPointerMove={onDragMove}
      onPointerUp={onDragUp}
    >
      {/* Raycast target — visible mesh with fully transparent material.
          NOTE: visible={false} would disable raycasting entirely. */}
      <mesh>
        <sphereGeometry args={[5.4, 24, 24]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <points ref={pointsRef} material={material} geometry={geometry} frustumCulled={false} />

      <AtmosphereGlow progressRef={smoothProgress} />
    </group>
  );
}

/* -------------------------------- Canvas ---------------------------------- */

export function DroneCanvas() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-auto"
      style={{ touchAction: "pan-y", cursor: "grab" }}
    >
      <Canvas
        camera={{ position: [0, 0.8, 14], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <ParticleGlobe />
      </Canvas>
    </div>
  );
}
