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
