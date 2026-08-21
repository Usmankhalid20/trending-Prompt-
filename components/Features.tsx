'use client';

const FEATURES = [
  {
    tag:   'PREVIEW',
    title: 'High-resolution previews',
    copy:  'See the full render before you commit to a prompt — every card shows a real example, not a thumbnail guess.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    tag:   'COPY',
    title: 'One-click prompt copy',
    copy:  'Copy the exact string, parameters included. No retyping, no missing weights or aspect ratios.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    tag:   'MJ · DALL·E · SD',
    title: 'Built for every model',
    copy:  'Prompts are tagged and formatted for Midjourney, DALL·E 3, and Stable Diffusion, so the syntax already matches your tool.',
    tagColor: '#A79FC4',
    tagBg: 'rgba(167,159,196,0.1)',
  },
  {
    tag:   'VERIFIED',
    title: 'Checked by admins',
    copy:  'Every prompt is tested and confirmed to render before it\'s published — no dead syntax, no surprises.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    tag:   'TAXONOMY',
    title: 'Organized by style',
    copy:  'Browse by category — couple portraits, editorial dress, fantasy scenes — filtered, not buried in folders.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    tag:   'SAVED',
    title: 'Your own workspace',
    copy:  'Save prompts you like, build a personal collection, and pick up your last search where you left off.',
    tagColor: '#A79FC4',
    tagBg: 'rgba(167,159,196,0.1)',
  },
] as const;

export default function Features() {
  return (
    <section
      id="features"
      style={{
        background: '#14121A',
        borderBottom: '1px solid #37324A',
        padding: '96px 24px',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
            WHAT YOU GET
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
            Everything you need for stunning AI image generation
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
              fontSize: 16,
              color: '#A79FC4',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            No guesswork. Find high-performing prompts, copy them with one click, and
            generate world-class artwork.
          </p>
        </div>

        {/* 6-card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.tag} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  tag,
  title,
  copy,
  tagColor,
  tagBg,
}: {
  tag: string;
  title: string;
  copy: string;
  tagColor: string;
  tagBg: string;
}) {
  return (
    <div
      style={{
        background: '#1D1926',
        border: '1px solid #37324A',
        borderRadius: 14,
        padding: '28px 28px 28px',
        transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = '#262131';
        el.style.borderColor = '#FF6B4A';
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = '#1D1926';
        el.style.borderColor = '#37324A';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Mono tag badge */}
      <span
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: tagColor,
          background: tagBg,
          border: `1px solid ${tagColor}33`,
          padding: '3px 9px',
          borderRadius: 4,
          marginBottom: 18,
        }}
      >
        {tag}
      </span>

      <h3
        style={{
          fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
          fontWeight: 600,
          fontSize: 17,
          color: '#EDE9F7',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
          fontSize: 14,
          lineHeight: 1.65,
          color: '#A79FC4',
          margin: 0,
        }}
      >
        {copy}
      </p>
    </div>
  );
}
