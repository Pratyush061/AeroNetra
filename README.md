# AeroNetra

A visually engaging web application showcasing drone and computer vision capabilities with high-impact 3D animations.

## Overview

AeroNetra is a Next.js-based single-page application focused on high-end 3D and scroll-responsive animations to demonstrate aerospace and computer vision technologies.

## Current Capabilities

- ✅ High-impact 3D particle globe hero section with interactive ribbon streams
- ✅ Scroll-responsive scrubbed animations via GSAP
- ✅ Perception Demo integration
- ✅ Hardware Showcase
- ✅ Open Source integration
- ✅ Call To Action (CTA) integration

## Technology Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- GSAP
- Framer Motion
- React Three Fiber (`three`, `@react-three/fiber`, `@react-three/drei`)
- Playwright (E2E Testing)

## Repository Structure

```text
src/
├── app/        # Next.js App Router pages and layouts
└── components/ # React components (3d, sections, ui)

e2e/            # Playwright end-to-end tests
public/         # Static assets
docs/           # Project documentation
```

## Prerequisites

- Node.js
- npm

## Installation

```bash
npm install
```

## Running the Project

```bash
npm run dev
```

## Configuration

- `API_KEY_21ST` configured via `.env.local`.
- *Note:* Do not commit `.npmrc` or `.env.local` files containing private credentials or API keys.

## Development Workflow

```bash
npm run lint
npm run build
npm run start
```

## Testing

Playwright is used for end-to-end testing and performance verification. Ensure the application is built before running tests.

```bash
npx playwright test
```

## Current Project Status

- ✅ Website interface
- ✅ 3D Canvas integration
- ✅ End-to-end testing setup
