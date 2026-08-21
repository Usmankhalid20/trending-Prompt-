'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

const TABS = ['all', 'draft', 'pending', 'approved', 'rejected'] as const;

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  draft:    { color: '#A79FC4', bg: 'rgba(167,159,196,0.1)' },
  pending:  { color: '#f0a45d', bg: 'rgba(240,164,93,0.1)' },
  approved: { color: '#83E6C9', bg: 'rgba(131,230,201,0.1)' },
  rejected: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.1)' },
  published:{ color: '#83E6C9', bg: 'rgba(131,230,201,0.1)' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 20, borderBottom: '1px solid #37324A' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, color: '#EDE9F7', margin: 0 }}>My Prompts</h1>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#A79FC4', margin: '4px 0 0' }}>Filter, edit, and track your submissions.</p>
        </div>
        <Link href="/creator/prompts/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans,sans-serif)', fontWeight: 600, fontSize: 13, color: '#14121A', background: '#FF6B4A', padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
          <PlusCircle size={14} /> Create Prompt
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', padding: '6px 14px',
              borderRadius: 6, border: 'none', cursor: 'pointer',
              background: tab === t ? '#FF6B4A22' : '#1D1926',
              color: tab === t ? '#FF6B4A' : '#A79FC4',
              borderBottom: tab === t ? '2px solid #FF6B4A' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-sans,sans-serif)', color: '#A79FC4', textAlign: 'center', padding: 40 }}>Loading...</p>
      ) : prompts.length === 0 ? (
        <div style={{ background: '#1D1926', border: '1px solid #37324A', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, color: '#A79FC4', margin: '0 0 12px' }}>No prompts in this category.</p>
          <Link href="/creator/prompts/new" style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, fontWeight: 600, color: '#FF6B4A' }}>Create your first →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
          {prompts.map((p) => {
            const st = STATUS_STYLE[p.status] ?? STATUS_STYLE.draft;
            const canEdit = ['draft', 'rejected'].includes(p.status);
            const canDelete = p.status === 'draft';
            return (
              <div key={p._id} style={{ background: '#1D1926', border: '1px solid #37324A', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Image Preview if available */}
                {p.image && (
                  <div style={{ width: '100%', height: 160, borderRadius: 8, overflow: 'hidden', background: '#14121A', border: '1px solid #37324A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#A79FC4', background: '#262131', border: '1px solid #37324A', borderRadius: 4, padding: '3px 8px' }}>{p.category ?? 'General'}</span>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: st.color, background: st.bg, border: `1px solid ${st.color}33`, borderRadius: 4, padding: '3px 8px', textTransform: 'uppercase' }}>{p.status}</span>
                </div>

                {/* Title + prompt */}
                <div>
                  <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: '#EDE9F7', margin: '0 0 6px' }}>{p.title}</p>
                  <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{p.prompt}</p>
                </div>

                {/* Rejection reason */}
                {p.status === 'rejected' && p.rejectionReason && (
                  <div style={{ display: 'flex', gap: 8, background: 'rgba(255,107,74,0.07)', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 8, padding: '8px 10px' }}>
                    <AlertCircle size={13} color="#FF6B4A" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 12, color: '#FF6B4A', margin: 0 }}>{p.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ paddingTop: 12, borderTop: '1px solid #37324A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4' }}>{new Date(p.updatedAt ?? p.createdAt).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {canEdit && (
                      <Link
                        href={`/creator/prompts/${p._id}/edit`}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans,sans-serif)', fontSize: 12, fontWeight: 600, color: '#83E6C9', background: 'rgba(131,230,201,0.08)', border: '1px solid rgba(131,230,201,0.2)', borderRadius: 6, padding: '5px 10px', textDecoration: 'none' }}
                      >
                        <Edit size={12} /> Edit
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans,sans-serif)', fontSize: 12, fontWeight: 600, color: '#FF6B4A', background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} /> {deleting === p._id ? '...' : 'Delete'}
                      </button>
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
