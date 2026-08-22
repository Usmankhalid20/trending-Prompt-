'use client';

const FEATURES = [
  {
    tag:   '01 / PREVIEW',
    title: 'High-resolution render previews',
    copy:  'See the full visual render before committing to a prompt — every card features artwork produced by the exact prompt syntax.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    tag:   '02 / COPY',
    title: 'One-click prompt syntax copy',
    copy:  'Copy full prompt recipes with model parameters, weights, and aspect ratio flags included. No missing parameters or syntax errors.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    tag:   '03 / TAXONOMY',
    title: 'Engineered for every model',
    copy:  'Prompts are formatted specifically for Midjourney v6, DALL·E 3, Stable Diffusion, and ChatGPT — so syntax matches your tool.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    tag:   '04 / VERIFIED',
    title: 'Tested by platform admins',
    copy:  'Every public prompt is tested to confirm rendering quality before approval — no dead syntax, no broken outputs.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    tag:   '05 / CREATOR',
    title: 'Creator publishing studio',
    copy:  'Prompt engineers can publish custom prompt recipes, track application approval status, and build their creator portfolio.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    tag:   '06 / SPEED',
    title: 'Sub-50ms Redis cache layer',
    copy:  'High-speed Redis query caching drops response times from 1,300ms down to ~40ms for lightning-fast search and filter performance.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
] as const;

export default function Features() {
  return (
    <section id="features" className="bg-[#14121A] border-b border-[#37324A] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs font-semibold tracking-widest text-[#83E6C9] uppercase">
            LIGHT-TABLE PLATFORM FEATURES
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#EDE9F7] tracking-tight">
            Built for precision prompt engineering
          </h2>
          <p className="font-sans text-base text-[#A79FC4] leading-relaxed">
            No guesswork. Real parameters, verified syntax, and zero bloat.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.tag}
              className="bg-[#1D1926] border border-[#37324A] rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B4A]/60 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Mono Tag Badge */}
                <span
                  style={{ color: f.tagColor, backgroundColor: f.tagBg, borderColor: `${f.tagColor}33` }}
                  className="inline-block font-mono text-[10px] font-semibold tracking-wider border px-2.5 py-1 rounded-md uppercase"
                >
                  {f.tag}
                </span>

                <h3 className="font-display font-semibold text-lg text-[#EDE9F7] tracking-tight">
                  {f.title}
                </h3>

                <p className="font-sans text-sm text-[#A79FC4] leading-relaxed">
                  {f.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
