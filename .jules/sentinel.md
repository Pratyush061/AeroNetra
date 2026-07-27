## 2024-05-24 - [Medium] Added Missing Security Headers to Next.js Config
**Vulnerability:** The application was missing standard HTTP security headers (e.g., X-Frame-Options, X-Content-Type-Options) in its responses, making it susceptible to basic attacks like clickjacking and MIME sniffing.
**Learning:** In Next.js, security headers are not added by default. They need to be explicitly configured in `next.config.ts` using the `headers` async function.
**Prevention:** Ensure that all new Next.js projects include a standard set of security headers in `next.config.ts` from the start.
