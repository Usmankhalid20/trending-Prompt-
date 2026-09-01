'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FannedPromptCarousel from '@/components/FannedPromptCarousel';

const ROTATING_WORDS = ['Midjourney', 'DALL·E 3', 'Cyberpunk', 'Architectural', 'Editorial', 'Stable Diffusion'];

export default function Hero() {
  /* 3D Kinetic Text Reel State */
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnimState, setWordAnimState] = useState<'enter' | 'exit'>('enter');

  /* Dynamic 3D Word Flip Reel (2.4s cycle) */
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordAnimState('exit');
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setWordAnimState('enter');
      }, 400);
    }, 2400);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <section className="relative bg-[#14121A] border-b border-[#37324A] pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">

      {/* ── Keyframes Style Block for 3D Kinetic Text & Shimmer Sweep ── */}
      <style jsx global>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroScaleIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes textShimmerSweep {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .anim-fade-up-1 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
        }
        .anim-fade-up-2 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
        }
        .anim-fade-up-3 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both;
        }
        .anim-fade-up-4 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
        .anim-scale-in {
          animation: heroScaleIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both;
        }

        .kinetic-word-enter {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
          filter: blur(0px);
        }
        .kinetic-word-exit {
          opacity: 0;
          transform: translateY(-24px) rotateX(60deg);
          filter: blur(4px);
        }
      `}</style>

      {/* Subdued Light-Table Ambient Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(131,230,201,0.05)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_50%_70%,rgba(255,107,74,0.06)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-12 relative z-10">

        {/* ── TOP SECTION: Apple/Framer-Level 3D Kinetic Text Reel & Headline ── */}
        <div className="max-w-3xl mx-auto space-y-6 items-center flex flex-col">

          {/* Eyebrow Tag */}
          <div className="anim-fade-up-1 inline-flex items-center gap-2 rounded-md border border-[#83E6C9]/30 bg-[#83E6C9]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#83E6C9] tracking-wider uppercase shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>LIGHT-TABLE PROMPT GALLERY</span>
          </div>

          {/* 3D Kinetic Perspective Headline */}
          <h1 className="anim-fade-up-2 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-[#EDE9F7]">
            Discover &amp; copy battle-tested{' '}
            <span
              className="inline-block relative overflow-hidden align-bottom"
              style={{ perspective: '800px' }}
            >
              <span
                className={`inline-block text-[#FF6B4A] transition-all duration-400 ease-out origin-bottom ${
                  wordAnimState === 'enter' ? 'kinetic-word-enter' : 'kinetic-word-exit'
                }`}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>{' '}
            image prompts.
          </h1>

          {/* Subtitle */}
          <p className="anim-fade-up-3 text-base sm:text-lg font-sans text-[#A79FC4] leading-relaxed max-w-2xl">
            A curated library of exact prompt recipes for Midjourney, DALL·E 3, and Stable
            Diffusion — tagged with real parameters and aspect ratios. Copy the exact syntax,
            paste it into your generator, and render.
          </p>

          {/* Action CTAs */}
          <div className="anim-fade-up-4 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#explore" id="hero-explore-cta">
              <Button size="lg" className="bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A] font-sans font-semibold gap-2 shadow-md text-base px-7 h-12 border-0 transition-transform active:scale-95">
                Explore Prompts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <Link href="/register" id="hero-register-cta">
              <Button variant="outline" size="lg" className="border-[#37324A] text-[#EDE9F7] hover:bg-[#1D1926] font-sans font-semibold text-base px-7 h-12">
                Create free account
              </Button>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM SECTION: 3D Fanned Editorial Card Carousel ── */}
        <div className="anim-scale-in w-full">
          <FannedPromptCarousel />
        </div>

      </div>
    </section>
  );
}