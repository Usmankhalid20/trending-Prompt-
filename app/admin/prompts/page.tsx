'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import AddPromptModal from '@/components/AddPromptModal';

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchPrompts = () => {
    setLoading(true);
    fetch(`/api/admin/prompts?status=${statusFilter}&search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrompts(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrompts();
  }, [statusFilter, search]);

  const handleAction = async (promptId: string, action: string, reason?: string) => {
    const res = await fetch(`/api/admin/prompts/${promptId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, rejectionReason: reason }),
    });

    if (res.ok) {
      setSelectedPrompt(null);
      setShowRejectInput(false);
      setRejectReason('');
      fetchPrompts();
    } else {
      const err = await res.json();
      alert(err.error || 'Action failed');
    }
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    await fetch(`/api/admin/prompts/${promptId}/review`, { method: 'DELETE' });
    fetchPrompts();
  };

  const [showAddModal, setShowAddModal] = useState(false);

  const handleSavePrompt = async (data: any) => {
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowAddModal(false);
      fetchPrompts();
    } else {
      const err = await res.json();
      alert(err.error || err.message || 'Failed to save prompt');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prompt Moderation & Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, review, approve, publish, reject, or hide submitted AI image prompts
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2 font-semibold shadow-xs">
          + Add AI Image Prompt
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'pending', 'approved', 'published', 'rejected', 'draft'].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="capitalize text-xs font-medium"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Prompts Table */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading moderation table...
        </div>
      ) : prompts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No prompts found matching current filters.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Prompt Info</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {prompts.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 max-w-xs">
                      <p className="font-semibold text-foreground truncate text-sm">{p.title}</p>
                      <p className="text-muted-foreground line-clamp-1 font-mono text-[11px] mt-0.5">
                        {p.prompt}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-foreground">{p.authorName || 'User'}</p>
                      <p className="text-muted-foreground text-[11px]">{p.authorEmail || 'N/A'}</p>
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === 'published' || p.status === 'approved'
                            ? 'default'
                            : p.status === 'pending'
                            ? 'secondary'
                            : p.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                        className="capitalize text-[10px]"
                      >
                        {p.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(p.createdAt || p.date).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPrompt(p)}
                          className="h-8 text-xs font-medium"
                        >
                          Review
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p._id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Delete Prompt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {selectedPrompt && (
        <Dialog open={!!selectedPrompt} onOpenChange={() => setSelectedPrompt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Review Prompt Submission</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-base">{selectedPrompt.title}</h3>
                <Badge variant="outline">{selectedPrompt.aiModel || 'ChatGPT'}</Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 bg-muted/40 p-3 rounded-lg">
                <p><span className="font-semibold text-foreground">Author:</span> {selectedPrompt.authorName} ({selectedPrompt.authorEmail})</p>
                <p><span className="font-semibold text-foreground">Category:</span> {selectedPrompt.category || 'General'}</p>
                <p><span className="font-semibold text-foreground">Current Status:</span> {selectedPrompt.status}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Prompt Payload</label>
                <div className="p-4 rounded-lg bg-muted border border-border font-mono text-xs leading-relaxed max-h-60 overflow-y-auto">
                  {selectedPrompt.prompt}
                </div>
              </div>

              {showRejectInput && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-destructive">Rejection Reason</label>
                  <Textarea
                    rows={3}
                    placeholder="Provide reason for rejecting this prompt..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
              {showRejectInput ? (
                <div className="flex items-center gap-2 w-full justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowRejectInput(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(selectedPrompt._id, 'reject', rejectReason)}
                  >
                    Confirm Rejection
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(selectedPrompt._id, selectedPrompt.visible ? 'hide' : 'publish')}
                      className="gap-1.5"
                    >
                      {selectedPrompt.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {selectedPrompt.visible ? 'Hide' : 'Publish'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectInput(true)}
                      className="gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(selectedPrompt._id, 'approve')}
                      className="gap-1.5 font-semibold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve & Publish
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAddModal && (
        <AddPromptModal
          prompt={null}
          onClose={() => setShowAddModal(false)}
          onSave={handleSavePrompt}
        />
      )}
    </div>
  );
}
