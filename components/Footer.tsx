'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#14121A',
        borderTop: '1px solid #37324A',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Logo + description */}
        <div>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              textDecoration: 'none',
              marginBottom: 6,
            }}
          >
            {/* Film-strip icon mark */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'linear-gradient(135deg,#FF6B4A,#e85a39)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="1" y="6.25" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="1" y="9.5" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="11.5" y="3" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="11.5" y="6.25" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="11.5" y="9.5" width="1.5" height="1.5" rx="0.3" fill="white" opacity="0.85" />
                <rect x="3" y="2" width="8" height="10" rx="1" fill="white" opacity="0.15" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                fontWeight: 700,
                fontSize: 15,
                color: '#EDE9F7',
                letterSpacing: '-0.01em',
              }}
            >
              AI Prompt Hub
            </span>
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
              fontSize: 13,
              color: '#A79FC4',
              margin: 0,
              maxWidth: 360,
              lineHeight: 1.55,
            }}
          >
            A curated library of tested AI image prompts — browse, copy, generate.
          </p>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
            fontSize: 12,
            color: '#A79FC4',
            margin: 0,
            opacity: 0.7,
          }}
        >
          &copy; {new Date().getFullYear()} AI Prompt Hub
        </p>
      </div>
    </footer>
  );
}
