'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-28 text-center px-4 sm:px-6 relative overflow-hidden border-b border-border transition-colors duration-200">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,74,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-[#83E6C9] tracking-wider uppercase shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>YOUR CREATIVE ACCELERATOR</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
          Stop searching. <br className="hidden sm:inline" />
          <span className="text-primary">Start creating.</span>
        </h2>

        {/* Subtext */}
        <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Browse proven image prompts and copy your next idea in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a href="#explore">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold text-base px-8 h-12 gap-2 shadow-lg border-0 transition-transform active:scale-95">
              Explore Prompts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>

          <Link href="/register" id="cta-join-free">
            <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-card font-sans font-semibold text-base px-8 h-12">
              Join Free
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
