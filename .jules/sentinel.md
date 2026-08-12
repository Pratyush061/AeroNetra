## 2024-05-24 - [Medium] Added Missing Security Headers to Next.js Config
**Vulnerability:** The application was missing standard HTTP security headers (e.g., X-Frame-Options, X-Content-Type-Options) in its responses, making it susceptible to basic attacks like clickjacking and MIME sniffing.
**Learning:** In Next.js, security headers are not added by default. They need to be explicitly configured in `next.config.ts` using the `headers` async function.
**Prevention:** Ensure that all new Next.js projects include a standard set of security headers in `next.config.ts` from the start.
## 2024-08-12 - [Missing Security Headers in Next.js config]
**Vulnerability:** The application was missing critical security headers, specifically Strict-Transport-Security (HSTS) and Permissions-Policy.
**Learning:** By default, Next.js does not configure these headers which protect against man-in-the-middle attacks (forcing HTTPS) and restrict browser features like camera and geolocation to prevent unintended access. These need to be explicitly configured in `next.config.ts`.
**Prevention:** Next.js projects should explicitly configure a comprehensive set of security headers via the `headers()` method in `next.config.ts`, specifically ensuring `Strict-Transport-Security` and `Permissions-Policy` are included alongside other standard protections like `X-Frame-Options` and `X-Content-Type-Options`.
