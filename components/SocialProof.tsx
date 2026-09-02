'use client';

import { Sparkles, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Finding the exact aspect ratio flags and stylize parameters in one place saved me dozens of failed Midjourney generations.',
    author: 'Elena R.',
    role: 'Digital Concept Artist',
    model: 'Midjourney v6',
  },
  {
    quote:
      'The visual previews are genuinely accurate to the prompt output. You copy the recipe and it renders exactly as expected.',
    author: 'Marcus K.',
    role: 'Creative Director',
    model: 'DALL·E 3',
  },
  {
    quote:
      'Finally, a prompt repository that treats prompt engineering with actual taxonomy rather than random messy lists.',
    author: 'Siddharth M.',
    role: 'AI Product Designer',
    model: 'SDXL / Midjourney',
  },
];

const METRICS = [
  {
    value: '100%',
    label: 'Parameter-Accurate',
    sub: 'Flags, weights & aspect tags verified',
  },
  {
    value: '3+ Engines',
    label: 'Model Support',
    sub: 'Midjourney, DALL·E 3, Stable Diffusion',
  },
  {
    value: '1-Click',
    label: 'Instant Copy',
    sub: 'Zero paywall or account needed to test',
  },
  {
    value: 'Verified',
    label: 'Quality Standard',
    sub: 'Real visual render with every card',
  },
];

export default function SocialProof() {
  return (
    <section className="bg-background border-b border-border py-16 sm:py-24 relative overflow-hidden transition-colors duration-200">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,74,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-[#83E6C9] tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TRUSTED BY PROMPT CREATORS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
            Built for creators building with AI
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            Reliable prompt syntax designed to elevate your creative generation workflow.
          </p>
        </div>

        {/* 4 Core Capability Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 text-left space-y-2 shadow-xs"
            >
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-primary">
                {m.value}
              </span>
              <h4 className="font-sans font-bold text-sm text-foreground">
                {m.label}
              </h4>
              <p className="font-mono text-[11px] text-muted-foreground leading-normal">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* 3 Creator Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-[#83E6C9] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {t.model}
                  </span>
                </div>

                <p className="font-sans text-sm text-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h5 className="font-display font-bold text-sm text-foreground">
                  {t.author}
                </h5>
                <p className="font-mono text-xs text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
