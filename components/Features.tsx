'use client';

import { Eye, Copy, Target, ShieldCheck, Bookmark, Send } from 'lucide-react';

const FEATURES = [
  {
    icon: Eye,
    tag: '01 / PREVIEW',
    title: 'See before you generate',
    copy: 'Every prompt includes a high-resolution render preview so you know the visual style and composition before spending generation credits.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    icon: Copy,
    tag: '02 / SYNTAX',
    title: 'Copy exactly what you need',
    copy: 'Get formatted, model-ready prompts instantly with all aspect ratio flags, stylize values, and parameter weights attached.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    icon: Target,
    tag: '03 / MODELS',
    title: 'Know which model it targets',
    copy: 'Prompts are organized and calibrated specifically for Midjourney v6, DALL·E 3, Stable Diffusion, and ChatGPT image engines.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    icon: ShieldCheck,
    tag: '04 / VERIFIED',
    title: 'Prompts that actually work',
    copy: 'Curated and tested submissions ensure you only explore working syntax that delivers predictable, high-fidelity results.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
  {
    icon: Bookmark,
    tag: '05 / ORGANIZE',
    title: 'Save your favorites',
    copy: 'Build your personal prompt collection, organize recipes by creative project, and pick up right where you left off.',
    tagColor: '#83E6C9',
    tagBg: 'rgba(131,230,201,0.1)',
  },
  {
    icon: Send,
    tag: '06 / CREATORS',
    title: 'Create & publish',
    copy: 'Share your own tested prompts with the creator community, track recipe copies, and establish your AI creator portfolio.',
    tagColor: '#FF6B4A',
    tagBg: 'rgba(255,107,74,0.1)',
  },
] as const;

export default function Features() {
  return (
    <section id="features" className="bg-background border-b border-border py-16 sm:py-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs font-semibold tracking-widest text-emerald-600 dark:text-[#83E6C9] uppercase">
            CREATOR-FIRST BENEFITS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
            Built for precision prompt engineering
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            No guesswork. Real parameters, verified syntax, and zero bloat.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.tag}
                className="bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    {/* Mono Tag Badge */}
                    <span
                      style={{ color: f.tagColor, backgroundColor: f.tagBg, borderColor: `${f.tagColor}33` }}
                      className="inline-block font-mono text-[10px] font-semibold tracking-wider border px-2.5 py-1 rounded-md uppercase"
                    >
                      {f.tag}
                    </span>
                    <Icon style={{ color: f.tagColor }} className="h-5 w-5" />
                  </div>

                  <h3 className="font-display font-semibold text-lg text-foreground tracking-tight">
                    {f.title}
                  </h3>

                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {f.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
