'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Clock, CheckCircle2, XCircle, FileEdit, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Stats = { total: number; drafts: number; pending: number; approved: number; rejected: number };

const STAT_CARDS = [
  { key: 'total',    label: 'Total Prompts',    iconColor: 'text-muted-foreground', Icon: FileText },
  { key: 'drafts',   label: 'Drafts',           iconColor: 'text-muted-foreground', Icon: FileEdit },
  { key: 'pending',  label: 'Pending Review',   iconColor: 'text-amber-500',        Icon: Clock },
  { key: 'approved', label: 'Approved',         iconColor: 'text-emerald-500',      Icon: CheckCircle2 },
  { key: 'rejected', label: 'Rejected',         iconColor: 'text-rose-500',         Icon: XCircle },
] as const;

const STATUS_BADGE_STYLE: Record<string, string> = {
  draft:    'bg-muted/50 text-muted-foreground border-border',
  pending:  'bg-amber-500/10 text-amber-500 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  published:'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
};

export default function CreatorDashboardPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/creator/prompts')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPrompts(d))
      .finally(() => setLoading(false));
  }, []);

  const stats: Stats = {
    total:    prompts.length,
    drafts:   prompts.filter((p) => p.status === 'draft').length,
    pending:  prompts.filter((p) => p.status === 'pending').length,
    approved: prompts.filter((p) => p.status === 'approved' || p.status === 'published').length,
    rejected: prompts.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
            Creator Studio Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your prompt submissions, creation progress, and review statuses.
          </p>
        </div>
        <Link href="/creator/prompts/new">
          <Button variant="default" className="gap-2 font-semibold shadow-xs">
            <PlusCircle className="h-4 w-4" />
            Create Prompt
          </Button>
        </Link>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map(({ key, label, iconColor, Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${iconColor}`} />
              <span className="font-mono text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                {label}
              </span>
            </div>
            <p className="font-display text-3xl font-black text-foreground leading-none">
              {stats[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Submissions List */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-foreground">Recent Submissions</h2>
          <Link
            href="/creator/prompts"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-sm font-medium text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading submissions...
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No prompts submitted yet.</p>
            <Link href="/creator/prompts/new">
              <Button variant="outline" size="sm" className="font-semibold gap-1.5">
                <PlusCircle className="h-3.5 w-3.5" /> Create your first prompt
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {prompts.slice(0, 6).map((p) => (
              <div key={p._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                  <p className="font-mono text-xs text-muted-foreground truncate">{p.prompt}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className={`text-[10px] uppercase font-mono font-semibold ${STATUS_BADGE_STYLE[p.status] || STATUS_BADGE_STYLE.draft}`}>
                    {p.status}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
