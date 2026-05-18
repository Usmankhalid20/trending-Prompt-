'use client';

import { LayoutDashboard, Settings, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'manage';
  onTabChange: (tab: 'dashboard' | 'manage') => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground">AI Prompts</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-secondary'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('manage')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'manage'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-secondary'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Manage Prompts</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link href="/">
          <Button
            variant="outline"
            className="w-full border-border hover:bg-secondary justify-start"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
