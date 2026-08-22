'use client';

const STEPS = [
  {
    num:   '01',
    label: '01 / DISCOVER',
    title: 'Browse & inspect',
    desc:  'Explore the light-table library by style category or target AI model, and inspect full prompt recipes.',
  },
  {
    num:   '02',
    label: '02 / COPY',
    title: 'One-click copy',
    desc:  'Click once to copy full prompt syntax with all aspect ratios and parameter weights attached.',
  },
  {
    num:   '03',
    label: '03 / GENERATE',
    title: 'Paste & render',
    desc:  'Paste directly into Midjourney, DALL·E 3, Stable Diffusion, or ChatGPT to generate your artwork.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#1D1926] border-b border-[#37324A] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs font-semibold tracking-widest text-[#83E6C9] uppercase">
            SIMPLE 3-STEP WORKFLOW
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#EDE9F7] tracking-tight">
            How AI Prompt Hub works
          </h2>
          <p className="font-sans text-base text-[#A79FC4] leading-relaxed">
            From discovering inspiration to generating world-class artwork in seconds.
          </p>
        </div>

        {/* 3 Steps Connected by Hairline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Connecting Hairline (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-9 left-[16.67%] right-[16.67%] h-[1px] bg-gradient-to-r from-[#37324A] via-[#FF6B4A]/50 to-[#37324A] z-0"
          />

          {STEPS.map((s) => (
            <div
              key={s.num}
              className="relative z-10 flex flex-col items-center text-center space-y-4 px-4 group"
            >
              {/* Mono-labelled Film Frame Counter Circle (01/02/03) */}
              <div className="w-18 h-18 rounded-full border border-[#37324A] bg-[#14121A] flex flex-col items-center justify-center shadow-lg group-hover:border-[#FF6B4A] transition-colors shrink-0">
                <span className="font-mono text-lg font-bold text-[#FF6B4A] leading-none">
                  {s.num}
                </span>
                <span className="font-mono text-[9px] font-semibold text-[#83E6C9] mt-1 tracking-wider uppercase">
                  FRAME
                </span>
              </div>

              {/* Step Title & Description */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] font-semibold text-[#83E6C9] tracking-wider uppercase">
                  {s.label}
                </span>
                <h3 className="font-display font-semibold text-xl text-[#EDE9F7] tracking-tight">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-[#A79FC4] leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
