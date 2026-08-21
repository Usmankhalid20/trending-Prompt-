'use client';

import { Eye, Copy, Wand2 } from 'lucide-react';

const STEPS = [
  {
    num:  '01',
    Icon: Eye,
    title: 'Browse & discover',
    desc:  'Scroll the library by style and open any card for the full prompt.',
  },
  {
    num:  '02',
    Icon: Copy,
    title: 'One-click copy',
    desc:  'Copy the exact prompt, parameters and all, straight to your clipboard.',
  },
  {
    num:  '03',
    Icon: Wand2,
    title: 'Paste & generate',
    desc:  'Drop it into Midjourney, DALL·E 3, or Stable Diffusion and render.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#1D1926',
        borderBottom: '1px solid #37324A',
        padding: '96px 24px',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#83E6C9',
              marginBottom: 16,
            }}
          >
            SIMPLE 3-STEP PROCESS
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: '#EDE9F7',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            How to use AI Prompt Hub
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
              fontSize: 16,
              color: '#A79FC4',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            From discovering inspiration to generating your own AI images in seconds.
          </p>
        </div>

        {/* Steps with connecting strip */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {/* Connecting hairline */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 36,
              left: 'calc(16.67% + 16px)',
              right: 'calc(16.67% + 16px)',
              height: 1,
              background: 'linear-gradient(90deg, #37324A 0%, #FF6B4A44 50%, #37324A 100%)',
              zIndex: 0,
            }}
          />

          {STEPS.map((s) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.num}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 16px',
                }}
              >
                {/* Film-frame counter */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    border: '1px solid #37324A',
                    background: '#14121A',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                      fontWeight: 600,
                      fontSize: 11,
                      color: '#FF6B4A',
                      letterSpacing: '0.08em',
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.num}
                  </span>
                  <Icon size={18} color="#A79FC4" strokeWidth={1.5} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#EDE9F7',
                    margin: '0 0 10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: '#A79FC4',
                    margin: 0,
                    maxWidth: 240,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 640px) {
          #how-it-works div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          #how-it-works div[style*="top: 36px"] {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
