'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Users,
  FolderTree,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminOverviewPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/prompts').then((res) => res.ok ? res.json() : []),
      fetch('/api/admin/users').then((res) => res.ok ? res.json() : []),
      fetch('/api/admin/categories').then((res) => res.ok ? res.json() : []),
    ])
      .then(([promptsData, usersData, categoriesData]) => {
        if (Array.isArray(promptsData)) setPrompts(promptsData);
        if (Array.isArray(usersData)) setUsers(usersData);
        if (Array.isArray(categoriesData)) setCategories(categoriesData);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPrompts = prompts.length;
  const pendingPrompts = prompts.filter((p) => p.status === 'pending');
  const publishedPrompts = prompts.filter((p) => p.status === 'published' || p.status === 'approved').length;
  const totalUsers = users.length;

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Admin Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor system metrics, process moderation queue, and oversee user activity
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Pending Moderation</p>
            <p className="text-2xl font-bold text-foreground">{pendingPrompts.length}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Published Prompts</p>
            <p className="text-2xl font-bold text-foreground">{publishedPrompts}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Registered Users</p>
            <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground">
            <FolderTree className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Active Categories</p>
            <p className="text-2xl font-bold text-foreground">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Moderation Queue Preview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Moderation Queue</h2>
            <p className="text-xs text-muted-foreground">Prompts awaiting review and publishing</p>
          </div>
          <Link href="/admin/prompts" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Open Full Queue
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
            Fetching pending submissions...
          </div>
        ) : pendingPrompts.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Queue clear!</p>
            <p className="text-xs text-muted-foreground">There are no prompts pending admin approval at this moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {pendingPrompts.slice(0, 5).map((p) => (
              <div key={p._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">{p.aiModel || 'ChatGPT'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">By {p.authorName || p.authorEmail || 'User'}</p>
                </div>
                <Link href="/admin/prompts">
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Review Prompt
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
