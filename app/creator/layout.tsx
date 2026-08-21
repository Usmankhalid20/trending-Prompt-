'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Wand2, Compass, ArrowLeft } from 'lucide-react';
import { PortalSidebar } from '@/components/PortalSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
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
      <div className="min-h-screen bg-background flex items-center justify-center text-sm font-medium text-muted-foreground animate-pulse">
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

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 text-center shadow-xl space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto">
            <Wand2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="uppercase tracking-widest font-mono text-[10px]">
              {user.status || 'PENDING APPROVAL'}
            </Badge>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {statusTitles[user.status] || 'Access Restricted'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.status === 'pending' && 'Thank you for applying to become a Creator on AI Prompt Hub. Your application has been submitted and is currently awaiting review by a platform Administrator.'}
              {user.status === 'rejected' && 'Unfortunately, your creator application was not approved at this time. If you believe this is an error, please reach out to platform support.'}
              {user.status === 'suspended' && 'Your creator access has been suspended by an Administrator. Please contact platform support for further details.'}
            </p>
          </div>

          <div className="bg-secondary/40 border border-border/60 rounded-xl p-4 text-left space-y-1">
            <p className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">Applicant Profile</p>
            <p className="font-semibold text-foreground text-sm">{user.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Escape Routes (Fix Dead-End UX) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="default" size="sm" className="w-full gap-2 font-semibold shadow-xs">
                <Compass className="w-4 h-4" />
                Explore Prompts
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full sm:w-auto gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <PortalSidebar role="creator" user={user} onLogout={logout} />
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
