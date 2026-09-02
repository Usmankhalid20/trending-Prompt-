'use client';

import { ShieldCheck, Zap, Sparkles, Layers } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Sparkles,
    title: 'Curated Prompts',
    desc: 'Tested for high output fidelity',
    color: '#83E6C9',
  },
  {
    icon: Layers,
    title: 'Model-Specific Syntax',
    desc: 'Midjourney v6, DALL·E 3, SDXL',
    color: '#FF6B4A',
  },
  {
    icon: Zap,
    title: 'One-Click Copy',
    desc: 'Full parameters, weights & aspect flags',
    color: '#83E6C9',
  },
  {
    icon: ShieldCheck,
    title: 'Visual Previews Included',
    desc: 'See the render before generating',
    color: '#FF6B4A',
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-card/70 border-b border-border py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 ${
                  idx > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
                }`}
              >
                <div
                  style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}35` }}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Icon style={{ color: item.color }} className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-foreground">
                    {item.title}
                  </h4>
                  <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground">
                    {item.desc}
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
