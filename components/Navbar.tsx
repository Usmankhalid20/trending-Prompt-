'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  const navLinks = [
    { label: 'Explore Prompts', href: '/explore' },
    { label: 'Features',        href: '/#features' },
    { label: 'How It Works',    href: '/#how-it-works' },
    { label: 'Become a Creator', href: '/creator/register' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 backdrop-blur-md border-b ${
        scrolled
          ? 'bg-background/90 border-border shadow-xs'
          : 'bg-background/70 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group text-decoration-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <span className="flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            AI Prompt Hub
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Auth Actions + Theme Toggle ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <Link href={
              user.role === 'user' ? '/dashboard' :
              user.role === 'creator' ? '/creator' : '/admin'
            }>
              <Button size="sm" className="gap-2 font-semibold shadow-xs">
                <LayoutDashboard className="h-4 w-4" />
                {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" id="nav-login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Log In
                </Button>
              </Link>
              <Link href="/register" id="nav-get-started">
                <Button size="sm" className="font-semibold shadow-xs">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          <div className="pl-1 border-l border-border/60">
            <ThemeToggle />
          </div>
        </div>

        {/* ── Mobile Menu Control & Theme Toggle ── */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            id="nav-hamburger"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-border/60 flex flex-col space-y-2">
            {user ? (
              <Link
                href={
                  user.role === 'user' ? '/dashboard' :
                  user.role === 'creator' ? '/creator' : '/admin'
                }
                onClick={() => setMenuOpen(false)}
              >
                <Button className="w-full gap-2 font-semibold">
                  <LayoutDashboard className="h-4 w-4" />
                  {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
