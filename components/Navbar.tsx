'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { label: 'Explore Prompts', href: '#explore' },
    { label: 'Features',        href: '#features' },
    { label: 'How It Works',    href: '#how-it-works' },
    { label: 'Become a Creator', href: '/creator/register' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-background/95 border-border backdrop-blur-md shadow-lg'
          : 'bg-background/80 border-border/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ── Film-Strip Logo Mark ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            CS
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            AI Prompt Hub
          </span>
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-1.5 rounded-lg text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Actions & Theme Toggle ── */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <Link
              href={
                user.role === 'user'
                  ? '/dashboard'
                  : user.role === 'creator'
                  ? '/creator'
                  : '/admin'
              }
            >
              <Button size="sm" className="font-sans font-semibold gap-2 shadow-xs">
                <LayoutDashboard className="h-4 w-4" />
                {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" id="nav-login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary font-sans">
                  Log in
                </Button>
              </Link>
              <Link href="/register" id="nav-get-started">
                <Button size="sm" className="font-sans font-semibold shadow-xs transition-transform active:scale-95">
                  Create free account
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger Toggle & Theme Toggle ── */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            id="nav-hamburger"
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border flex flex-col space-y-2">
            {user ? (
              <Link
                href={
                  user.role === 'user'
                    ? '/dashboard'
                    : user.role === 'creator'
                    ? '/creator'
                    : '/admin'
                }
                onClick={() => setMenuOpen(false)}
              >
                <Button className="w-full font-semibold gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full font-semibold">
                    Create free account
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
