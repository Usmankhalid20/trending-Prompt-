'use client';

import { Award, Filter, Gauge, Sparkles } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Award,
      title: 'Quality Over Quantity',
      description:
        'We filter out low-effort or generic prompts. Every published prompt provides proven utility and accurate output.',
    },
    {
      icon: Filter,
      title: 'Curated Library',
      description:
        'Easily navigate prompts categorized by specific AI models, developer use-cases, marketing needs, and design tasks.',
    },
    {
      icon: Gauge,
      title: 'Streamlined Workflow',
      description:
        'No friction. One-click copy, structured parameters, and direct testing guidelines to save hours of trial and error.',
    },
    {
      icon: Sparkles,
      title: 'Modern Experience',
      description:
        'Built with Next.js 16, dark mode support, fast search, and clean SaaS design for maximum developer productivity.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Why Choose Us
          </h2>
          <p className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Built for Serious AI Practitioners
          </p>
          <p className="text-base text-muted-foreground">
            Unlike unmoderated prompt boards, AI Prompt Hub prioritizes curated accuracy, community trust, and developer efficiency.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-5 p-6 rounded-xl border border-border/60 bg-card shadow-xs transition-all hover:border-primary/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
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
