# UI Development Skill for AeroNetra Project

## Overview
This document provides specialized guidelines for the UI development and frontend engineering specific to the AeroNetra project. When performing layout styling, typography adjustments, and integrating animations, agents must adhere to these instructions.

## Design System & Theme
- **Theme Palette:** The project uses an ultra-clean, high-contrast structural design system with a premium dark metallic color scheme. Use shades of black, dark gray, and metallic silver accents inspired by high-end car websites to ensure maximum text readability.
- **Do not use** light aerospace palettes from previous iterations.
- **Typography:** Employ massive typography to communicate clarity and impact.
- **Framework:** Utilize Tailwind CSS v4 `@theme` directives for configuration.

## Layout & Imagery
- Prioritize visually engaging layouts with relevant imagery (e.g., drones, computer vision technology).
- **Avoid:** Text-heavy, boring designs.

## Animations & 3D Interactivity
- Integrate high-impact, scroll-responsive 3D animations primarily in the hero section.
- Use **GSAP** and **Framer Motion** for smooth transition and micro-interactions.
- Use **React Three Fiber** (`three`, `@react-three/fiber`, `@react-three/drei`) for 3D elements, objects, and rendering inside the web application.

## Best Practices
- **Components:** Create reusable UI components based on 21st.dev and shadcn/ui conventions.
- **Styling Utility:** Use `clsx` and `tailwind-merge` for robust CSS class management.
- Ensure that the final product feels ultra-clean and high-end.
