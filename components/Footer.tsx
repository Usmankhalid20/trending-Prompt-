'use client';

import Link from 'next/link';
import { ArrowUp, Github, Twitter, Disc as Discord, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#14121A] border-t border-[#37324A] pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Subtle Accent Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(131,230,201,0.03)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* ── TOP ROW: Brand Column & Multi-Column Navigation ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Identity & System Status Column (5 cols) */}
          <div className="md:col-span-5 space-y-4 text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF6B4A] text-[#14121A] font-mono font-extrabold text-xs shadow-md transition-transform group-hover:scale-105">
                CS
              </span>
              <span className="font-display font-extrabold text-lg text-[#EDE9F7] tracking-tight">
                AI Prompt Hub
              </span>
            </Link>

            <p className="font-sans text-sm text-[#A79FC4] leading-relaxed max-w-sm">
              A curated light-table library &amp; battle-tested prompt engineering marketplace for Midjourney, DALL·E 3, Stable Diffusion, and ChatGPT.
            </p>

            {/* System Status Pill */}
            {/* <div className="inline-flex items-center gap-2 rounded-md border border-[#83E6C9]/30 bg-[#83E6C9]/10 px-3 py-1 text-xs font-mono font-medium text-[#83E6C9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#83E6C9] animate-pulse" />
              <span>SYSTEM OPERATIONAL • REDIS CACHE ACTIVE</span>
            </div> */}
          </div>

          {/* Nav Column 1: Explore Prompts (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#EDE9F7] uppercase tracking-wider">
              EXPLORE
            </h3>
            <ul className="space-y-2 font-sans text-xs text-[#A79FC4]">
              <li>
                <a href="#explore" className="hover:text-[#FF6B4A] transition-colors">Midjourney Recipes</a>
              </li>
              <li>
                <a href="#explore" className="hover:text-[#FF6B4A] transition-colors">DALL·E 3 Prompts</a>
              </li>
              <li>
                <a href="#explore" className="hover:text-[#FF6B4A] transition-colors">Stable Diffusion</a>
              </li>
              <li>
                <a href="#explore" className="hover:text-[#FF6B4A] transition-colors">Editorial &amp; Fashion</a>
              </li>
              <li>
                <a href="#explore" className="hover:text-[#FF6B4A] transition-colors">Architecture Renders</a>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Ecosystem Portals (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#EDE9F7] uppercase tracking-wider">
              PORTALS &amp; PLATFORM
            </h3>
            <ul className="space-y-2 font-sans text-xs text-[#A79FC4]">
              <li>
                <Link href="/creator/register" className="hover:text-[#FF6B4A] transition-colors flex items-center gap-1.5">
                  <span>Become a Creator</span>
                  <span className="font-mono text-[9px] bg-[#FF6B4A]/10 text-[#FF6B4A] px-1.5 py-0.5 rounded border border-[#FF6B4A]/30">STUDIO</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#FF6B4A] transition-colors">User Workspace</Link>
              </li>
              <li>
                <Link href="/creator" className="hover:text-[#FF6B4A] transition-colors">Creator Studio Dashboard</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#FF6B4A] transition-colors">Admin Moderation Queue</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[#83E6C9] transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#83E6C9]" />
                  <span>Technical Documentation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Trust & Specs (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#EDE9F7] uppercase tracking-wider">
              SPECS &amp; LEGAL
            </h3>
            <ul className="space-y-2 font-sans text-xs text-[#A79FC4]">
              <li>
                <span className="text-[#A79FC4]/80">Privacy Policy</span>
              </li>
              <li>
                <span className="text-[#A79FC4]/80">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#A79FC4]/80">API v1.0 Docs</span>
              </li>
              <li>
                <span className="font-mono text-[10px] text-[#83E6C9]/80">VERIFIED SYNTAX</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM BAR: Film Contact Sheet Footer Bar ── */}
        <div className="pt-8 border-t border-[#37324A]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A79FC4]">
          
          {/* Copyright & Film Mark */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} AI Prompt Hub.</span>
            <span className="hidden sm:inline text-[#37324A]">•</span>
            {/* <span className="text-[#83E6C9]">CS·LIGHT-TABLE-PROMPT-ENGINEERING</span> */}
          </div>

          {/* Social Icons & Back to Top Trigger */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="text-[#A79FC4] hover:text-[#EDE9F7] transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter Community"
              className="text-[#A79FC4] hover:text-[#EDE9F7] transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord Channel"
              className="text-[#A79FC4] hover:text-[#EDE9F7] transition-colors"
            >
              <Discord className="h-4 w-4" />
            </a>

            <div className="h-3 w-px bg-[#37324A]" aria-hidden="true" />

            {/* Back to top Button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#A79FC4] hover:text-[#FF6B4A] transition-colors font-mono text-xs"
              aria-label="Scroll to top of page"
            >
              <span>TOP</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
