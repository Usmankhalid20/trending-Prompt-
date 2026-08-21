'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/PortalSidebar';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <PortalSidebar role="user" user={user} onLogout={handleLogout} />
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
