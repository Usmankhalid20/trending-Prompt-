'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  Users,
  FolderTree,
  UserCheck,
  Shield,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          if (data.user.role === 'user') {
            router.push('/admin/login');
          } else {
            setUser(data.user);
          }
        }
      });
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, permission: 'dashboard:view' },
    { name: 'Prompt Queue', href: '/admin/prompts', icon: FileCheck2, permission: 'prompts:view' },
    { name: 'Creators', href: '/admin/creators', icon: UserCheck, permission: 'creators:view' },
    { name: 'User Management', href: '/admin/users', icon: Users, permission: 'users:view' },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree, permission: 'categories:manage' },
    { name: 'Admin Management', href: '/admin/admins', icon: UserCheck, permission: 'admins:view' },
    { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield, superAdminOnly: true },
    { name: 'Audit Logs', href: '/admin/logs', icon: History, permission: 'logs:view' },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings, permission: 'settings:manage' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span>Admin Portal</span>
        </Link>
        <Button variant="ghost" size="icon" aria-label="Toggle mobile menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 border-r border-border bg-card p-6 flex flex-col justify-between shrink-0`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/admin" className="hidden md:flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-foreground leading-none">
                AI Prompt Hub
              </span>
              <span className="text-[11px] font-semibold text-primary mt-0.5">Admin Portal</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.superAdminOnly && user?.role !== 'super_admin') return null;
              if (
                item.permission &&
                user?.role !== 'super_admin' &&
                !user?.permissions?.includes(item.permission)
              ) {
                return null;
              }

              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-6 border-t border-border space-y-3">
          {user && (
            <div className="px-3 py-2.5 rounded-lg bg-secondary/50 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <Badge variant="outline" className="capitalize text-[10px] font-mono">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
