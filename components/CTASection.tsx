'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="bg-[#F3F0FA] py-20 sm:py-28 text-center px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Eyebrow */}
        <span className="inline-block font-mono text-xs font-semibold tracking-widest text-[#FF6B4A] uppercase">
          JOIN THE PROMPT HUB COMMUNITY
        </span>

        {/* Headline (Space Grotesk, ONE color #14121A) */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#14121A] tracking-tight leading-tight">
          Your next prompt is one copy away.
        </h2>

        {/* Subtext (IBM Plex Sans) */}
        <p className="font-sans text-base sm:text-lg text-[#3a3550] leading-relaxed max-w-xl mx-auto">
          Create a free account to save prompts, build a personal collection, and pick up where you left off.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/register" id="cta-register">
            <Button size="lg" className="bg-[#FF6B4A] hover:bg-[#e85a39] text-white font-sans font-semibold text-base px-8 h-12 gap-2 shadow-lg border-0 transition-transform active:scale-95">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/login" id="cta-login">
            <Button variant="outline" size="lg" className="border-[#14121A]/30 text-[#14121A] hover:bg-[#14121A]/10 font-sans font-semibold text-base px-8 h-12">
              Log in
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
