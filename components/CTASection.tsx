'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      style={{
        /* Paper band — the one high-contrast light moment on the page */
        background: '#F3F0FA',
        padding: '96px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#FF6B4A',
            marginBottom: 20,
          }}
        >
          GET STARTED
        </span>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
            fontWeight: 700,
            fontSize: 'clamp(30px, 4.5vw, 48px)',
            lineHeight: 1.1,
            color: '#14121A',
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
          }}
        >
          Your next prompt is one copy away.
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
            fontSize: 17,
            lineHeight: 1.65,
            color: '#3a3550',
            margin: '0 0 40px',
          }}
        >
          Create a free account to save prompts, build a personal collection, and
          pick up where you left off.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/register"
            id="cta-register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 600,
              fontSize: 15,
              color: '#fff',
              background: '#FF6B4A',
              padding: '13px 28px',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'background 0.15s, transform 0.15s',
              boxShadow: '0 4px 20px rgba(255,107,74,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#e85a39';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#FF6B4A';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Create free account
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/login"
            id="cta-login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 600,
              fontSize: 15,
              color: '#14121A',
              background: 'transparent',
              padding: '13px 28px',
              borderRadius: 10,
              border: '1.5px solid #37324A44',
              textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#14121A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#37324A44';
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
