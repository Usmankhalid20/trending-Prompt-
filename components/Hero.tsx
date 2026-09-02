'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FannedPromptCarousel from '@/components/FannedPromptCarousel';

export default function Hero() {
  return (
    <section className="relative bg-background border-b border-border pt-12 pb-14 sm:pt-16 sm:pb-20 overflow-hidden transition-colors duration-200">

      {/* ── Keyframes Style Block ── */}
      <style jsx global>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroScaleIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .anim-fade-up-1 {
          animation: heroFadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) 50ms both;
        }
        .anim-fade-up-2 {
          animation: heroFadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
        }
        .anim-fade-up-3 {
          animation: heroFadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) 350ms both;
        }
        .anim-fade-up-4 {
          animation: heroFadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both;
        }
        .anim-scale-in {
          animation: heroScaleIn 1100ms cubic-bezier(0.16, 1, 0.3, 1) 650ms both;
        }
      `}</style>

      {/* Subdued Ambient Radial Wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(131,230,201,0.06)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_50%_65%,rgba(255,107,74,0.07)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8 sm:space-y-10 relative z-10">

        {/* ── TOP HEADLINE & OUTCOME VALUE PROPOSITION ── */}
        <div className="max-w-3xl mx-auto space-y-5 items-center flex flex-col">

          {/* Small Eyebrow Badge */}
          <div className="anim-fade-up-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-[#83E6C9] tracking-wider uppercase shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TESTED PROMPT RECIPES</span>
          </div>

          {/* Outcome-Focused Headline */}
          <h1 className="anim-fade-up-2 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-foreground">
            Find image prompts <br className="hidden sm:inline" />
            <span className="text-primary">that actually work.</span>
          </h1>

          {/* Value Subtext */}
          <p className="anim-fade-up-3 text-base sm:text-lg font-sans text-muted-foreground leading-relaxed max-w-2xl">
            Tested prompts for Midjourney, DALL·E, Stable Diffusion, and more — copy, customize, and generate in seconds.
          </p>

          {/* Primary Action CTAs */}
          <div className="anim-fade-up-4 flex flex-wrap items-center justify-center gap-3 pt-1">
            <a href="#explore" id="hero-explore-cta">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold gap-2 shadow-lg text-base px-7 h-12 border-0 transition-transform active:scale-95">
                Explore Prompts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <Link href="/register" id="hero-register-cta">
              <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary font-sans font-semibold text-base px-7 h-12">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 20-30% ENLARGED PROMPT-CARD FAN SHOWCASE ── */}
        <div className="anim-scale-in w-full pt-1">
          <FannedPromptCarousel />
        </div>

      </div>
    </section>
  );
}