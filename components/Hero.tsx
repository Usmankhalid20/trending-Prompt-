'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/* ── Sample hero prompt card data ────────────────────── */
const HERO_CARD = {
  frameId:  'CS·014',
  aspect:   '16:9',
  model:    'MJ v6',
  title:    'Twilight Couple Portrait',
  prompt:
    '/imagine prompt: cinematic twilight couple portrait, golden hour backlight, film grain, soft bokeh, editorial fashion styling, --ar 16:9 --v 6 --stylize 750',
  /* Abstract gradient swatch — no external images needed */
  gradient: 'linear-gradient(135deg,#3d2c6e 0%,#7c3a5c 35%,#c8704a 65%,#f0a45d 100%)',
};

const BACK_CARDS = [
  { rot: '-7deg',  gradient: 'linear-gradient(135deg,#1a3a52 0%,#2d6a8a 50%,#83E6C9 100%)', id:'bc1' },
  { rot: '5deg',   gradient: 'linear-gradient(135deg,#2e1a52 0%,#5c3a8a 50%,#FF6B4A 100%)', id:'bc2' },
];

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(HERO_CARD.prompt).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const fallbackCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = HERO_CARD.prompt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  return (
    <section
      style={{
        background: '#14121A',
        borderBottom: '1px solid #37324A',
        padding: '80px 24px 96px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle radial glow behind hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 55% at 70% 45%, rgba(131,230,201,0.06) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 30% 60%, rgba(255,107,74,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {/* ── Left: copy ── */}
        <div style={{ gridColumn: '1 / span 6' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#83E6C9',
              background: 'rgba(131,230,201,0.08)',
              border: '1px solid rgba(131,230,201,0.2)',
              padding: '5px 12px',
              borderRadius: 6,
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#83E6C9', flexShrink: 0 }} />
            CURATED PROMPT LIBRARY
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 60px)',
              lineHeight: 1.1,
              color: '#EDE9F7',
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}
          >
            Discover &amp; generate{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #FF6B4A, #f0a45d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              stunning AI artwork.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
              fontSize: 17,
              lineHeight: 1.65,
              color: '#A79FC4',
              margin: '0 0 36px',
              maxWidth: 520,
            }}
          >
            A tested library of image prompts for Midjourney, DALL·E 3, and Stable
            Diffusion — couple portraits, editorial dress, fantasy scenes, and more.
            Copy the exact syntax, paste it in, and render.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/explore"
              id="hero-explore-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-sans, sans-serif)',
                fontWeight: 600,
                fontSize: 15,
                color: '#14121A',
                background: '#FF6B4A',
                padding: '12px 24px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.15s',
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
              Explore AI Image Prompts
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="#14121A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href="/register"
              id="hero-register-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontWeight: 600,
                fontSize: 15,
                color: '#EDE9F7',
                background: 'transparent',
                padding: '12px 24px',
                borderRadius: 10,
                border: '1px solid #37324A',
                textDecoration: 'none',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#A79FC4';
                (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#37324A';
                (e.currentTarget as HTMLAnchorElement).style.color = '#EDE9F7';
              }}
            >
              Create free account
            </Link>
          </div>
        </div>

        {/* ── Right: film-card light table ── */}
        <div
          style={{
            gridColumn: '7 / span 6',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          {/* Back cards */}
          {BACK_CARDS.map((bc) => (
            <div
              key={bc.id}
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 310,
                height: 380,
                borderRadius: 12,
                background: bc.gradient,
                border: '1px solid rgba(55,50,74,0.6)',
                transform: `rotate(${bc.rot})`,
                opacity: 0.55,
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              }}
            />
          ))}

          {/* Front card */}
          <div
            style={{
              position: 'relative',
              width: 320,
              borderRadius: 12,
              background: '#1D1926',
              border: '1px solid #37324A',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-1.5deg) translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 28px 80px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)';
            }}
          >
            {/* Sprocket strip (film leader top) */}
            <div
              aria-hidden="true"
              style={{
                background: '#37324A',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 5 }}>
                {[0,1,2,3,4].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: 7,
                      height: 10,
                      borderRadius: 1,
                      border: '1px solid rgba(165,159,196,0.3)',
                      background: 'rgba(20,18,26,0.6)',
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#83E6C9',
                  letterSpacing: '0.08em',
                }}
              >
                {HERO_CARD.frameId} — {HERO_CARD.aspect} — {HERO_CARD.model}
              </span>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0,1,2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: 7,
                      height: 10,
                      borderRadius: 1,
                      border: '1px solid rgba(165,159,196,0.3)',
                      background: 'rgba(20,18,26,0.6)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Gradient artwork swatch */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                background: HERO_CARD.gradient,
                position: 'relative',
              }}
            >
              {/* Subtle label overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 12,
                  fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'rgba(237,233,247,0.55)',
                  letterSpacing: '0.06em',
                }}
              >
                AI RENDER PREVIEW
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '16px 16px 18px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#EDE9F7',
                  margin: '0 0 10px',
                }}
              >
                {HERO_CARD.title}
              </p>

              {/* Prompt string */}
              <div
                style={{
                  background: '#14121A',
                  border: '1px solid #37324A',
                  borderRadius: 8,
                  padding: '10px 12px',
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: '#A79FC4',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {HERO_CARD.prompt}
                </p>
              </div>

              {/* Copy button */}
              <button
                id="hero-copy-btn"
                onClick={handleCopy}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 8,
                  padding: '10px 16px',
                  background: copied ? '#22a97a' : '#FF6B4A',
                  color: copied ? '#fff' : '#14121A',
                  transition: 'background 0.25s, transform 0.15s',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  if (!copied) (e.currentTarget as HTMLButtonElement).style.background = '#e85a39';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  if (!copied) (e.currentTarget as HTMLButtonElement).style.background = '#FF6B4A';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
                aria-label={copied ? 'Prompt copied to clipboard' : 'Copy prompt to clipboard'}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span className="toast-in">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive: stack on mobile ── */}
      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns"] > div:first-child {
            grid-column: 1 / -1 !important;
          }
          section > div[style*="grid-template-columns"] > div:last-child {
            grid-column: 1 / -1 !important;
          }
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
