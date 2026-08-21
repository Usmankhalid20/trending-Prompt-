'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  Wand2,
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  FileCheck2,
  Users,
  FolderTree,
  UserCheck,
  Shield,
  History,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  permission?: string;
  superAdminOnly?: boolean;
}

interface PortalSidebarProps {
  role: 'user' | 'creator' | 'admin';
  user: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
    permissions?: string[];
  } | null;
  onLogout: () => void;
  customNavItems?: NavItem[];
}

const ROLE_CONFIG: Record<
  'user' | 'creator' | 'admin',
  { portalTitle: string; portalSubtitle: string; icon: any; defaultNav: NavItem[] }
> = {
  user: {
    portalTitle: 'User Portal',
    portalSubtitle: 'User Workspace',
    icon: Sparkles,
    defaultNav: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Saved Prompts', href: '/dashboard/prompts', icon: FileText },
      { name: 'Profile & Security', href: '/dashboard/profile', icon: User },
    ],
  },
  creator: {
    portalTitle: 'Creator Studio',
    portalSubtitle: 'Prompt Creator',
    icon: Wand2,
    defaultNav: [
      { name: 'Overview', href: '/creator', icon: LayoutDashboard },
      { name: 'My Submissions', href: '/creator/prompts', icon: FileText },
      { name: 'Create Prompt', href: '/creator/prompts/new', icon: PlusCircle },
      { name: 'Profile & Bio', href: '/creator/profile', icon: User },
    ],
  },
  admin: {
    portalTitle: 'Admin Portal',
    portalSubtitle: 'Platform Management',
    icon: ShieldCheck,
    defaultNav: [
      { name: 'Overview', href: '/admin', icon: LayoutDashboard, permission: 'dashboard:view' },
      { name: 'Prompt Queue', href: '/admin/prompts', icon: FileCheck2, permission: 'prompts:view' },
      { name: 'Creators', href: '/admin/creators', icon: UserCheck, permission: 'creators:view' },
      { name: 'User Management', href: '/admin/users', icon: Users, permission: 'users:view' },
      { name: 'Categories', href: '/admin/categories', icon: FolderTree, permission: 'categories:manage' },
      { name: 'Admin Management', href: '/admin/admins', icon: UserCheck, permission: 'admins:view' },
      { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield, superAdminOnly: true },
      { name: 'Audit Logs', href: '/admin/logs', icon: History, permission: 'logs:view' },
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings, permission: 'settings:manage' },
    ],
  },
};

export function PortalSidebar({ role, user, onLogout, customNavItems }: PortalSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const cfg = ROLE_CONFIG[role];
  const IconMark = cfg.icon;
  const navItems = customNavItems || cfg.defaultNav;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* ── Mobile Top Header Bar ── */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <IconMark className="h-4 w-4" />
          </div>
          <span>{cfg.portalTitle}</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle mobile sidebar menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Sidebar Component (Desktop + Mobile Drawer) ── */}
      <aside
        className={`${
          sidebarOpen ? 'fixed inset-0 z-50 pt-16 bg-card flex flex-col p-6' : 'hidden'
        } md:flex md:flex-col md:static w-full md:w-64 border-r border-border bg-card p-6 justify-between shrink-0 md:h-screen md:sticky md:top-0`}
      >
        <div className="space-y-8">
          
          {/* Logo & Portal Branding Header */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
                <IconMark className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-foreground leading-none">
                  AI Prompt Hub
                </span>
                <span className="text-[11px] font-semibold text-primary mt-0.5">
                  {cfg.portalSubtitle}
                </span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label={`${cfg.portalTitle} navigation`}>
            {navItems.map((item) => {
              if (role === 'admin') {
                if (item.superAdminOnly && user?.role !== 'super_admin') return null;
                if (
                  item.permission &&
                  user?.role !== 'super_admin' &&
                  !user?.permissions?.includes(item.permission)
                ) {
                  return null;
                }
              }

              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out Button */}
        <div className="pt-4 border-t border-border space-y-3 mt-auto">
          {user && (
            <div className="p-3 rounded-xl bg-muted/60 border border-border/80 space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-primary/20 bg-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs font-sans">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-foreground truncate leading-snug">
                      {user.name}
                    </p>
                  </div>
                  {user.email && (
                    <p className="text-[11px] text-muted-foreground truncate font-mono">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {user.role && (
                <div className="pt-1 flex items-center justify-between border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Role
                  </span>
                  <Badge variant="outline" className="capitalize text-[10px] font-sans font-semibold bg-primary/10 text-primary border-primary/30">
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSignOutModal(true)}
            className="w-full justify-start gap-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/30 hover:border-red-500/50 font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* ── Sign Out Confirmation Modal (Yes / No) ── */}
      <AlertDialog open={showSignOutModal} onOpenChange={setShowSignOutModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to sign out of your account? You will need to log back in to access your portal workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-3 gap-2">
            <AlertDialogCancel onClick={() => setShowSignOutModal(false)} className="font-semibold text-xs">
              No, Stay Logged In
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowSignOutModal(false);
                setSidebarOpen(false);
                onLogout();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-xs"
            >
              Yes, Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
