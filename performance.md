# Performance & Animation Rendering Audit

## Methodology
The performance audit was conducted locally via Playwright, simulating different device and network profiles including Desktop High-End, Desktop Throttled (Slow 3G, 4x CPU throttle), iPhone 14, and Galaxy S22.

## Metrics Overview
- **Desktop High-End:** Load time ~568ms
- **iPhone 14 (Simulated):** Load time ~270ms
- **Galaxy S22 (Simulated):** Load time ~449ms
- **Desktop Throttled (Slow 3G, 4x CPU):** Load time ~805ms (Note: local network speeds may skew these results lower than real-world WAN latency, but relative differences show the impact of CPU throttling).

## Animation & 3D Rendering (React Three Fiber)
**Current Setup:** The hero section uses `DroneCanvas` (React Three Fiber) alongside GSAP for text reveals.

**Performance Findings:**
1. **Garbage Collection (GC) Pressure in Animations:**
   A common pitfall in React Three Fiber (R3F) is instantiating new objects (e.g., `new THREE.Vector3()`) inside `useFrame`. This creates immense GC pressure, causing micro-stutters, especially noticeable on throttled CPUs (like the simulated Slow 3G/Throttled profile).
   - *Requirement*: Strict adherence to pre-allocating objects outside the render loop and using `.copy()`, `.set()`, or `.add()`.
2. **Scroll-Linked Animations (GSAP ScrollTrigger):**
   The current Hero component uses GSAP `ScrollTrigger` with `scrub: 1.2` for parallax. While GSAP is performant, binding DOM scroll events to complex 3D shader uniforms via React state can cause frame drops.
   - *Requirement*: Pass scroll progress via React `useRef` directly to R3F materials/shaders instead of triggering React state re-renders.
3. **Mobile Canvas Scaling:**
   The `DroneCanvas` must aggressively scale down particle counts or geometry complexity on mobile devices (e.g., detecting `isMobile` via window width or user-agent) to maintain 60fps on devices like the iPhone 14 or older Androids.

## Medium / Slow Speed Network Impact
- Assets like large 3D models (GLTF/GLB) or background videos will block interaction if not loaded asynchronously.
- *Recommendation*: Implement a visually appealing `<Suspense>` fallback (like a wireframe loader or a pulsing logo) while the main `DroneCanvas` loads.

## Actionable Recommendations
1. **R3F Optimization**: Audit all `useFrame` hooks in `components/3d/` to ensure zero object instantiation per frame.
2. **Dynamic Imports**: Use `next/dynamic` to load heavy 3D components, improving initial JS bundle size and TTFB.
3. **Asset Compression**: Ensure any textures used in WebGL are compressed (e.g., KTX2 or WebP) and appropriately sized (powers of two).
