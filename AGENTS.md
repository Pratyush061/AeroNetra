<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Master Instructions for AeroNetra Project

## Global Project Scope
This project is a single-page web application for AeroNetra. It is focused on showcasing visually engaging layouts with relevant imagery (e.g., drones, computer vision) and high-impact, scroll-responsive 3D animations in the hero section. Avoid text-heavy, boring designs.

## Tech Stack
- Framework: Next.js App Router
- Core Library: React (19.x)
- Language: TypeScript
- Styling: Tailwind CSS v4 (using @theme directives)
- Testing: Playwright (@playwright/test) for e2e and performance verification

Do not use standalone HTML/CSS. Do not mix React with Vue or other frameworks.

## Code Style and Architecture
- Maintain a reusable React component architecture built on **21st.dev** and **shadcn/ui** conventions.
- Use `clsx` and `tailwind-merge` for class management.
- Use `lucide-react` for icons.
- Utilize GSAP, Framer Motion, and React Three Fiber (`three`, `@react-three/fiber`, `@react-three/drei`) for professional, high-end 3D and scroll animations.
- For MCP connections or 21st.dev integration (e.g., `API_KEY_21ST`), store secrets in a git-ignored `.env.local` file rather than hardcoding them in `.mcp.json` or source code.
- Ensure that the project is strictly single-page, utilizing responsive components.

## Build Commands
- Dev Server: `npm run dev`
- Build: `npm run build`
- Start Production Server: `npm run start`
- Lint: `npm run lint`

## Multi-Agent Skill Routing
Please refer to the specific task instructions inside `.agents/skills/[skill-name]/SKILL.md` for detailed instructions on individual modules or tasks.

## Recent Architecture Notes (for maintainers)

### Hero 3D Particle Globe (`src/components/3d/DroneCanvas.tsx`)
- Custom Three.js `ShaderMaterial` on `THREE.Points` — **do not** replace with `drei` `<Points>` (raycasting + custom attributes tie into shader).
- Two particle layers built in `buildParticles()`:
  - **Continent dots** sampled via rejection against a hand-crafted polygon land mask (`NORTH_AMERICA`, `EURASIA`, etc. in `[lat, lon]` degrees). Antarctica is a latitude-band shortcut. Islands are circular blobs.
  - **Sparse lat/long grid** for planetary structure.
- Vertex shader morphs particles from globe → **ribbon streams** (Stripe/Linear-style flowing bands) driven by `uProgress` (0..1, mapped from `scrollY / innerHeight`). 6 horizontal bands, alternating flow direction, multi-frequency sway (fake fBm). No DNA/tornado helix — that was replaced.
- Raycasting uses `ray.intersectSphere(radius 6)` (not a plane) so cursor tracking works across the full globe including the lower hemisphere.
- GLSL gotchas: `active` is a reserved word — use `hoverActive`. R3F `<bufferAttribute>` can be flaky; the file uses a manually constructed `THREE.BufferGeometry` for reliability.
- `frustumCulled={false}` on the points — ribbons stream off-screen intentionally.
- No new npm dependencies are permitted (corporate JFrog Artifactory mirror; see `.npmrc` — **never commit this file**).

### Scroll Animations (all section components)
All non-hero reveal animations use **scrubbed** ScrollTrigger — motion is tied 1:1 to scroll position, replaying on scroll up. Pattern:
```ts
gsap.fromTo(el, from, {
  ...to,
  ease: "power2.out",
  scrollTrigger: {
    trigger: el,
    start: "top 90%",
    end: "top 45%",
    scrub: 1,          // 1s smoothing catchup
  },
});
```
- Sections using this pattern: `Features.tsx`, `Showcase.tsx`, `OpenSource.tsx`, `CTA.tsx`.
- **Do not** use `filter: blur()` inside scroll animations — kills GPU compositor path. Prefer `transform` + `opacity` only.
- Staggered lists use per-item `start`/`end` offsets (see `Showcase.tsx` list items) instead of GSAP `delay`, so each item has its own scrub window.

### Hero Text Overlay (`src/components/sections/Hero.tsx`)
- The text container has `pointer-events-none` so the underlying canvas receives cursor events across the entire hero. Interactive children (heading `<h1>`, description `<p>`, buttons wrapper) re-enable via `pointer-events-auto`. Preserve this pattern when adding new hero content.

### Secrets / npm registry
- `.npmrc` contains a private JFrog Artifactory auth token and is git-ignored. Contributors must supply their own. Never commit tokens.
- No `.env.local` values are required for runtime; MCP/21st.dev keys (if any) also stay in `.env.local`.

### Testing
- Playwright is the only test framework. Verify hero interactions (drag, cursor, scroll spiral) manually via `npm run dev` — no automated visual regression tests exist yet.

