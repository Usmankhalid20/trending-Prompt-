'use client';

import { Copy, Wand2 } from 'lucide-react';
import Image from 'next/image';

const STEPS = [
  {
    num: '01',
    badge: '01 / DISCOVER',
    title: 'Browse visual prompts',
    desc: 'Explore the curated repository by style, model, or use case and preview real high-resolution renders.',
    mockup: (
      <div className="w-full h-32 rounded-xl bg-secondary border border-border relative overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
          alt="Discover prompt"
          fill
          className="object-cover opacity-85"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
        <div className="absolute bottom-2 left-2 right-2 bg-card/90 backdrop-blur-xs border border-border px-2.5 py-1 rounded text-left">
          <span className="font-mono text-[9px] text-emerald-600 dark:text-[#83E6C9] font-bold uppercase">Brutalist Monolith</span>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    badge: '02 / COPY',
    title: 'Copy exact prompt syntax',
    desc: 'Click once to copy the formatted recipe with all aspect ratio flags, weights, and version flags attached.',
    mockup: (
      <div className="w-full h-32 rounded-xl bg-secondary/80 border border-border p-3 flex flex-col justify-between text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-emerald-600 dark:text-[#83E6C9] uppercase font-semibold">Recipe Code</span>
            <span className="font-mono text-[9px] text-muted-foreground">--ar 16:9</span>
          </div>
          <p className="font-mono text-[10px] text-foreground line-clamp-2">
            /imagine prompt: brutalist concrete architectural corridor --v 6.0 --stylize 850
          </p>
        </div>
        <div className="w-full bg-primary text-primary-foreground font-sans font-bold text-[11px] py-1 rounded flex items-center justify-center gap-1.5 shadow-sm">
          <Copy className="h-3 w-3" /> Copied Syntax
        </div>
      </div>
    ),
  },
  {
    num: '03',
    badge: '03 / CREATE',
    title: 'Paste & render anywhere',
    desc: 'Paste directly into Midjourney, DALL·E 3, or Stable Diffusion to generate your final artwork.',
    mockup: (
      <div className="w-full h-32 rounded-xl bg-secondary border border-border relative overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
          alt="Generated artwork"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded font-mono text-[9px] font-bold flex items-center gap-1 shadow-md">
          <Wand2 className="h-2.5 w-2.5" /> 100% Rendered
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/30 border-b border-border py-16 sm:py-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs font-semibold tracking-widest text-emerald-600 dark:text-[#83E6C9] uppercase">
            ACTIVE 3-STEP WORKFLOW
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
            How AI Prompt Hub works
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            From discovering inspiration to generating world-class artwork in seconds.
          </p>
        </div>

        {/* 3 Step Cards with Visual Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left shadow-sm hover:border-primary/60 transition-colors group"
            >
              {/* Step Header & Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-emerald-600 dark:text-[#83E6C9] tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                    {s.badge}
                  </span>
                  <span className="font-mono text-base font-bold text-primary">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-foreground tracking-tight">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Visual Interactive Mockup */}
              <div className="pt-2">
                {s.mockup}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
