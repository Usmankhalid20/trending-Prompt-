'use client';

import { XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const COMPARISON_ROWS = [
  {
    feature: 'Model Compatibility',
    others: 'Generic prompts that fail or break across different model versions',
    hub: 'Calibrated syntax for Midjourney v6, DALL·E 3, and Stable Diffusion',
  },
  {
    feature: 'Visual Proof',
    others: 'No preview or mismatched generic stock photos',
    hub: 'Full visual renders produced by the exact prompt syntax',
  },
  {
    feature: 'Copy Readiness',
    others: 'Missing parameters, aspect ratio flags, and weight modifiers',
    hub: '1-click copy with complete flags (--ar, --stylize, --v, weights)',
  },
  {
    feature: 'Quality Control',
    others: 'Unmoderated junk and non-functioning prompts',
    hub: 'Curated and tested submissions for high rendering fidelity',
  },
  {
    feature: 'Workflow & Organization',
    others: 'Scattered bookmarks on Pinterest, Reddit, or Discord channels',
    hub: 'Personal saved collections, creator studio, and organized taxonomy',
  },
];

export default function ComparisonSection() {
  return (
    <section className="bg-secondary/30 border-b border-border py-16 sm:py-24 relative overflow-hidden transition-colors duration-200">
      
      {/* Subtle Ambient Radial Wash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(131,230,201,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-semibold text-primary tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE REAL DIFFERENCE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
            Why creators use AI Prompt Hub
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            Stop wasting generation credits on broken prompts found on social media.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Left: Random Prompt Websites */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 text-left shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Searching Random Websites &amp; Social Media
                </h3>
                <p className="font-mono text-xs text-muted-foreground">Pinterest, Reddit, random blogs</p>
              </div>
            </div>

            <ul className="space-y-4">
              {COMPARISON_ROWS.map((row) => (
                <li key={row.feature} className="space-y-1">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                    {row.feature}
                  </span>
                  <div className="flex items-start gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500/80 shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {row.others}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: AI Prompt Hub (Illuminated in Coral/Mint) */}
          <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-8 space-y-6 text-left shadow-xl relative">
            
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 right-6 bg-primary text-primary-foreground font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Engineered Solution
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-[#83E6C9]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  AI Prompt Hub
                </h3>
                <p className="font-mono text-xs text-emerald-600 dark:text-[#83E6C9] font-medium">Precision prompt repository</p>
              </div>
            </div>

            <ul className="space-y-4">
              {COMPARISON_ROWS.map((row) => (
                <li key={row.feature} className="space-y-1">
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-[#83E6C9] uppercase tracking-wider block font-semibold">
                    {row.feature}
                  </span>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#83E6C9] shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                      {row.hub}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link href="/register" className="w-full block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold h-11 text-sm gap-2 border-0 shadow-lg">
                  Start Exploring Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
