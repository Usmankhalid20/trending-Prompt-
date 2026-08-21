'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { label: 'Overview',      href: '/creator',              Icon: LayoutDashboard },
  { label: 'My Prompts',    href: '/creator/prompts',      Icon: FileText },
  { label: 'Create Prompt', href: '/creator/prompts/new',  Icon: PlusCircle },
  { label: 'Profile',       href: '/creator/profile',      Icon: User },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; status: string } | null>(null);
  const [menuOpen, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/creator/register') {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (d?.user?.role !== 'creator') {
          router.replace('/login');
        } else {
          setUser(d.user);
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router, pathname]);

  if (pathname === '/creator/register') {
    return <>{children}</>;
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#14121A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A79FC4', fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14 }}>
        Loading Creator Studio...
      </div>
    );
  }

  // Handle Non-Approved Account States (pending, rejected, suspended)
  if (user && user.status !== 'approved' && user.status !== 'active') {
    const statusTitles: Record<string, string> = {
      pending: 'Creator Application Under Review',
      rejected: 'Creator Application Rejected',
      suspended: 'Creator Account Suspended',
    };
    const statusBadges: Record<string, { label: string; color: string; bg: string; border: string }> = {
      pending: { label: 'PENDING APPROVAL', color: '#F59E0B', bg: '#F59E0B1A', border: '#F59E0B44' },
      rejected: { label: 'REJECTED', color: '#EF4444', bg: '#EF44441A', border: '#EF444444' },
      suspended: { label: 'SUSPENDED', color: '#EF4444', bg: '#EF44441A', border: '#EF444444' },
    };

    const currentBadge = statusBadges[user.status] || statusBadges.pending;

    return (
      <div style={{ minHeight: '100vh', background: '#14121A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 520, background: '#1D1926', border: '1px solid #37324A', borderRadius: 16, padding: 36, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#FF6B4A,#e85a39)', marginBottom: 20 }}>
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="4" y="3" width="10" height="12" rx="1.5" fill="white" opacity="0.15" />
            </svg>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono,monospace)', color: currentBadge.color, background: currentBadge.bg, border: `1px solid ${currentBadge.border}`, letterSpacing: '0.05em' }}>
              {currentBadge.label}
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 22, fontWeight: 700, color: '#EDE9F7', margin: '0 0 12px 0' }}>
            {statusTitles[user.status] || 'Access Restricted'}
          </h2>

          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, color: '#A79FC4', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            {user.status === 'pending' && 'Thank you for applying to become a Creator on AI Prompt Hub. Your application has been submitted and is waiting for review by a platform Administrator.'}
            {user.status === 'rejected' && 'Unfortunately, your creator application was not approved at this time. If you believe this is an error, please reach out to support.'}
            {user.status === 'suspended' && 'Your creator access has been suspended by an Administrator. Please contact platform support for further details.'}
          </p>

          <div style={{ background: '#262131', border: '1px solid #37324A', borderRadius: 10, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
            <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#83E6C9', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Applicant Profile</p>
            <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, fontWeight: 600, color: '#EDE9F7', margin: '0 0 2px 0' }}>{user.name}</p>
            <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: '#A79FC4', margin: 0 }}>{user.email}</p>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'inline-flex', alignItems: 'center', justifySelf: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8,
              background: 'none', border: '1px solid #37324A', cursor: 'pointer',
              fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, fontWeight: 600, color: '#EDE9F7',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF6B4A'; (e.currentTarget as HTMLButtonElement).style.color = '#FF6B4A'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#37324A'; (e.currentTarget as HTMLButtonElement).style.color = '#EDE9F7'; }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const Sidebar = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '28px 20px',
        gap: 0,
      }}
    >
      {/* Logo */}
      <div>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}
        >
          <span
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg,#FF6B4A,#e85a39)', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="1" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="4" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="8" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="15" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
              <rect x="4" y="3" width="10" height="12" rx="1.5" fill="white" opacity="0.15" />
            </svg>
          </span>
          <div>
            <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, color: '#EDE9F7', margin: 0, lineHeight: 1.1 }}>AI Prompt Hub</p>
            <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: '#83E6C9', margin: 0, letterSpacing: '0.06em' }}>CREATOR STUDIO</p>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenu(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                  fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, fontWeight: 500,
                  background: active ? '#FF6B4A22' : 'transparent',
                  color: active ? '#FF6B4A' : '#A79FC4',
                  borderLeft: active ? '2px solid #FF6B4A' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User + Logout */}
      <div style={{ borderTop: '1px solid #37324A', paddingTop: 16 }}>
        {user && (
          <div style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 8, background: '#262131' }}>
            <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, fontWeight: 600, color: '#EDE9F7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
            <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: 'none', border: '1px solid #37324A', cursor: 'pointer',
            fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, fontWeight: 500, color: '#A79FC4',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FF6B4A'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF6B4A44'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#A79FC4'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#37324A'; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#14121A', display: 'flex' }}>

      {/* Desktop sidebar */}
      <aside
        style={{ width: 240, flexShrink: 0, background: '#1D1926', borderRight: '1px solid #37324A', height: '100vh', position: 'sticky', top: 0 }}
        className="hidden-below-720"
      >
        {Sidebar}
      </aside>

      {/* Mobile top bar */}
      <div className="show-below-720" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(29,25,38,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #37324A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: '#EDE9F7' }}>Creator Studio</span>
        <button onClick={() => setMenu((v) => !v)} aria-label="Toggle navigation menu" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDE9F7' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="show-below-720" style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#1D1926', paddingTop: 64 }}>
          {Sidebar}
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: '48px 32px', overflowY: 'auto', maxWidth: 1100, margin: '0 auto', width: '100%' }} className="main-padding">
        {children}
      </main>

      <style>{`
        @media (max-width: 719px) {
          .hidden-below-720 { display: none !important; }
          .main-padding { padding: 88px 20px 40px !important; }
        }
        @media (min-width: 720px) {
          .show-below-720 { display: none !important; }
        }
      `}</style>
    </div>
  );
}
