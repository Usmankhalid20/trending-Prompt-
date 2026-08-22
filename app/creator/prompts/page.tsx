'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TABS = ['all', 'draft', 'pending', 'approved', 'rejected'] as const;

const STATUS_BADGE_STYLE: Record<string, string> = {
  draft:    'bg-muted/50 text-muted-foreground border-border',
  pending:  'bg-amber-500/10 text-amber-500 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  published:'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
};

export default function CreatorPromptsPage() {
  const router = useRouter();
  const [tab,      setTab]      = useState<typeof TABS[number]>('all');
  const [prompts,  setPrompts]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch_ = (t: typeof TABS[number]) => {
    setLoading(true);
    fetch(`/api/creator/prompts${t !== 'all' ? `?status=${t}` : ''}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPrompts(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(tab); }, [tab]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this draft? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/creator/prompts/${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetch_(tab);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">My Submissions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Filter, edit, and track your prompt submissions.</p>
        </div>
        <Link href="/creator/prompts/new">
          <Button variant="default" className="gap-2 font-semibold shadow-xs">
            <PlusCircle className="h-4 w-4" /> Create Prompt
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              tab === t
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card text-muted-foreground border border-border/80 hover:text-foreground hover:bg-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading prompts...
        </div>
      ) : prompts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground">No prompts in this status category.</p>
          <Link href="/creator/prompts/new">
            <Button variant="outline" size="sm" className="font-semibold">
              Create your first prompt →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map((p) => {
            const canEdit = ['draft', 'rejected'].includes(p.status);
            const canDelete = p.status === 'draft';
            return (
              <div
                key={p._id}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Image Preview if available */}
                  {p.image && (
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-secondary/40 border border-border relative flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground bg-secondary/50">
                      {p.category ?? 'General'}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] font-mono font-semibold uppercase ${STATUS_BADGE_STYLE[p.status] || STATUS_BADGE_STYLE.draft}`}>
                      {p.status}
                    </Badge>
                  </div>

                  {/* Title + Prompt payload */}
                  <div>
                    <h3 className="font-display font-semibold text-base text-foreground line-clamp-1">{p.title}</h3>
                    <p className="font-mono text-xs text-muted-foreground line-clamp-3 mt-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                      {p.prompt}
                    </p>
                  </div>

                  {/* Rejection notice */}
                  {p.status === 'rejected' && p.rejectionReason && (
                    <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="leading-snug">{p.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(p.updatedAt ?? p.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <Link href={`/creator/prompts/${p._id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                          <Edit className="h-3.5 w-3.5 text-emerald-500" /> Edit
                        </Button>
                      </Link>
                    )}
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        className="h-8 gap-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> {deleting === p._id ? '...' : 'Delete'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
