# Technical SEO Audit

## Current State Analysis
AeroNetra is built using Next.js App Router, which provides excellent foundational support for SEO (Server-Side Rendering, Server Components).

**Strengths:**
- Basic metadata is present in `app/layout.tsx` (`title`, `description`).
- Usage of semantic HTML (`<main>`, `<section>`, `<h1>`) is generally good.

**Weaknesses & Missing Elements:**

1. **Missing Open Graph & Twitter Cards:**
   The `layout.tsx` metadata is extremely basic. For a premium tech site, rich social sharing cards are essential.
   ```typescript
   // Missing fields in layout.tsx:
   openGraph: { type: 'website', url: '...', title: '...', description: '...', images: [...] }
   twitter: { card: 'summary_large_image', site: '...', creator: '...', images: [...] }
   ```

2. **No `robots.txt` or `sitemap.xml`:**
   Crucial for search engine crawlers to discover and index pages correctly. Next.js supports generating these easily via `app/sitemap.ts` and `app/robots.ts`.

3. **Missing Alt Text on Canvas/Interactive Elements:**
   While 3D elements (React Three Fiber) don't have traditional `alt` tags, we must ensure there are fallback text descriptions or aria-labels for screen readers (which impacts accessibility scores, a proxy for SEO).

4. **Performance Impact on Core Web Vitals:**
   Loading heavy 3D assets (React Three Fiber) in the hero section can severely impact Largest Contentful Paint (LCP) if not handled correctly.
   - *Issue*: `DroneCanvas` appears to be loaded synchronously on the client.
   - *Fix*: Wrap heavy 3D components in `next/dynamic` with `ssr: false` to prevent blocking the initial HTML render and to improve Time to First Byte (TTFB) and First Contentful Paint (FCP).

5. **Canonical URLs:**
   Missing canonical URL definitions in metadata.

## Actionable Recommendations
1. **Implement Rich Metadata**: Update `app/layout.tsx` to include complete Open Graph and Twitter Card configurations.
2. **Add Sitemap and Robots**: Create `app/sitemap.ts` and `app/robots.ts`.
3. **Optimize Asset Loading**: Dynamically import `@react-three/fiber` components to defer loading until after the critical rendering path.
4. **Structured Data (JSON-LD)**: Add Schema.org structured data (e.g., `Organization`, `SoftwareApplication`) to the `layout.tsx` to help Google understand the business context.
