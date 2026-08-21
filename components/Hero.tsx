'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Sample hero prompt card data ────────────────────── */
const HERO_CARD = {
  frameId:  'CS·014',
  aspect:   '16:9',
  model:    'MJ v6',
  title:    'Twilight Couple Portrait',
  prompt:
    '/imagine prompt: cinematic twilight couple portrait, golden hour backlight, film grain, soft bokeh, editorial fashion styling, --ar 16:9 --v 6 --stylize 750',
  gradient: 'linear-gradient(135deg,#3d2c6e 0%,#7c3a5c 35%,#c8704a 65%,#f0a45d 100%)',
};

const BACK_CARDS = [
  { rot: '-rotate-6', gradient: 'linear-gradient(135deg,#1a3a52 0%,#2d6a8a 50%,#83E6C9 100%)', id: 'bc1' },
  { rot: 'rotate-6',  gradient: 'linear-gradient(135deg,#2e1a52 0%,#5c3a8a 50%,#FF6B4A 100%)', id: 'bc2' },
];

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(HERO_CARD.prompt).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const fallbackCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = HERO_CARD.prompt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  return (
    <section className="relative bg-background border-b border-border py-16 sm:py-24 overflow-hidden">
      {/* Background Glow Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_70%_45%,rgba(131,230,201,0.06)_0%,transparent_70%),radial-gradient(ellipse_45%_40%_at_30%_60%,rgba(255,107,74,0.07)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ── Left Column: Copy & Actions ── */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400 tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span>CURATED AI PROMPT LIBRARY</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground">
            Discover &amp; generate{' '}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent">
              stunning AI artwork.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A tested library of image prompts for Midjourney, DALL·E 3, and Stable
            Diffusion — couple portraits, editorial dress, fantasy scenes, and more.
            Copy the exact syntax, paste it in, and render.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/explore" id="hero-explore-cta">
              <Button size="lg" className="font-semibold gap-2 shadow-sm text-base px-6 h-12">
                Explore AI Image Prompts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/register" id="hero-register-cta">
              <Button variant="outline" size="lg" className="font-semibold text-base px-6 h-12">
                Create free account
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Right Column: Showcase Card Stack ── */}
        <div className="lg:col-span-5 relative flex justify-center items-center min-h-[380px]">
          
          {/* Back Decorative Cards */}
          {BACK_CARDS.map((bc) => (
            <div
              key={bc.id}
              aria-hidden="true"
              style={{ background: bc.gradient }}
              className={`absolute w-72 sm:w-80 h-96 rounded-2xl border border-border/40 ${bc.rot} opacity-55 shadow-2xl transition-transform`}
            />
          ))}

          {/* Front Showcase Card */}
          <div className="relative w-72 sm:w-80 rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden hover:-translate-y-1 hover:rotate-[-1deg] transition-all duration-300">
            
            {/* Film Leader Header Bar */}
            <div
              aria-hidden="true"
              className="bg-muted/80 px-3 py-1.5 flex items-center justify-between border-b border-border/60"
            >
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="block w-1.5 h-2.5 rounded-xs border border-muted-foreground/30 bg-background/60" />
                ))}
              </div>
              <span className="font-mono text-[10px] font-semibold text-primary tracking-wider">
                {HERO_CARD.frameId} — {HERO_CARD.aspect} — {HERO_CARD.model}
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block w-1.5 h-2.5 rounded-xs border border-muted-foreground/30 bg-background/60" />
                ))}
              </div>
            </div>

            {/* Gradient Swatch Preview */}
            <div
              style={{ background: HERO_CARD.gradient }}
              className="w-full aspect-16/9 relative"
            >
              <div
                aria-hidden="true"
                className="absolute bottom-2.5 left-3 font-mono text-[10px] font-semibold text-white/70 tracking-wider"
              >
                AI RENDER PREVIEW
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 space-y-3">
              <p className="font-display font-semibold text-sm text-foreground">
                {HERO_CARD.title}
              </p>

              {/* Prompt Syntax Box */}
              <div className="bg-background border border-border/60 rounded-lg p-2.5">
                <p className="font-mono text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
                  {HERO_CARD.prompt}
                </p>
              </div>

              {/* Interactive Copy Button */}
              <Button
                id="hero-copy-btn"
                onClick={handleCopy}
                variant={copied ? 'default' : 'secondary'}
                className={`w-full font-semibold h-9 text-xs gap-1.5 transition-all ${
                  copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                }`}
                aria-label={copied ? 'Prompt copied to clipboard' : 'Copy prompt to clipboard'}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy prompt</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
