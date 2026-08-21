'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard } from 'lucide-react';

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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled
          ? 'rgba(20,18,26,0.88)'
          : 'rgba(20,18,26,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? '#37324A' : 'transparent'}`,
        transition: 'background-color 0.25s, border-color 0.25s',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          {/* Sprocket icon mark */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#FF6B4A,#e85a39)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="4" y="3" width="10" height="12" rx="1.5" fill="white" opacity="0.15" />
              <rect x="5" y="4.5" width="8" height="9" rx="1" fill="white" opacity="0.25" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontWeight: 700,
              fontSize: 17,
              color: '#EDE9F7',
              letterSpacing: '-0.01em',
            }}
          >
            AI Prompt Hub
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          aria-label="Main navigation"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          className="hidden-mobile"
        >
          <style>{`
            @media (max-width: 719px) { .hidden-mobile { display: none !important; } }
            @media (min-width: 720px) { .show-mobile   { display: none !important; } }
          `}</style>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
                fontSize: 14,
                fontWeight: 500,
                color: '#A79FC4',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 8,
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#EDE9F7';
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(237,233,247,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#A79FC4';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop auth actions ── */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          className="hidden-mobile"
        >
          {user ? (
            <Link
              href={
                user.role === 'user'    ? '/dashboard' :
                user.role === 'creator' ? '/creator'   : '/admin'
              }
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-sans, sans-serif)', fontSize: 14, fontWeight: 600,
                color: '#14121A', background: '#FF6B4A', padding: '7px 16px',
                borderRadius: 8, textDecoration: 'none',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#e85a39';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#FF6B4A';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <LayoutDashboard size={14} />
              {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#A79FC4',
                  textDecoration: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#EDE9F7')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#A79FC4')}
              >
                Log In
              </Link>
              <Link
                href="/register"
                id="nav-get-started"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#14121A',
                  background: '#FF6B4A',
                  padding: '7px 16px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.15s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#e85a39';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#FF6B4A';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          id="nav-hamburger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="show-mobile"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#EDE9F7',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(20,18,26,0.97)',
            borderTop: '1px solid #37324A',
            padding: '16px 24px 24px',
          }}
          className="show-mobile"
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#A79FC4',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: 8,
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user ? (
                <Link
                  href={
                    user.role === 'user'    ? '/dashboard' :
                    user.role === 'creator' ? '/creator'   : '/admin'
                  }
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#14121A',
                    background: '#FF6B4A',
                    padding: '10px 16px',
                    borderRadius: 8,
                    textDecoration: 'none',
                  }}
                >
                  {user.role === 'user' ? 'User Portal' : user.role === 'creator' ? 'Creator Studio' : 'Admin Portal'}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#A79FC4',
                      border: '1px solid #37324A',
                      padding: '10px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#14121A',
                      background: '#FF6B4A',
                      padding: '10px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
