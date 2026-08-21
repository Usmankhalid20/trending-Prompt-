'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Clock, CheckCircle2, XCircle, FileEdit, ArrowRight } from 'lucide-react';

type Stats = { total: number; drafts: number; pending: number; approved: number; rejected: number };

const STAT_CARDS = [
  { key: 'total',    label: 'Total Prompts',    color: '#A79FC4', Icon: FileText },
  { key: 'drafts',   label: 'Drafts',           color: '#A79FC4', Icon: FileEdit },
  { key: 'pending',  label: 'Pending Review',   color: '#f0a45d', Icon: Clock },
  { key: 'approved', label: 'Approved',         color: '#83E6C9', Icon: CheckCircle2 },
  { key: 'rejected', label: 'Rejected',         color: '#FF6B4A', Icon: XCircle },
] as const;

const STATUS_COLOR: Record<string, string> = {
  draft:    '#A79FC4',
  pending:  '#f0a45d',
  approved: '#83E6C9',
  rejected: '#FF6B4A',
  published:'#83E6C9',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 24, borderBottom: '1px solid #37324A' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 28, color: '#EDE9F7', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, color: '#A79FC4', margin: '4px 0 0' }}>
            Track your prompt submissions and review statuses.
          </p>
        </div>
        <Link
          href="/creator/prompts/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-sans,sans-serif)', fontWeight: 600, fontSize: 14,
            color: '#14121A', background: '#FF6B4A', padding: '9px 18px', borderRadius: 8,
            textDecoration: 'none', transition: 'background 0.15s',
          }}
        >
          <PlusCircle size={15} />
          Create Prompt
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
        {STAT_CARDS.map(({ key, label, color, Icon }) => (
          <div key={key} style={{ background: '#1D1926', border: '1px solid #37324A', borderRadius: 12, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={16} color={color} />
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color, letterSpacing: '0.06em' }}>{label.toUpperCase()}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 32, color: '#EDE9F7', margin: 0, lineHeight: 1 }}>
              {stats[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div style={{ background: '#1D1926', border: '1px solid #37324A', borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 17, color: '#EDE9F7', margin: 0 }}>Recent Submissions</h2>
          <Link href="/creator/prompts" style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#FF6B4A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, color: '#A79FC4', textAlign: 'center', padding: '32px 0' }}>Loading...</p>
        ) : prompts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, color: '#A79FC4', marginBottom: 16 }}>No prompts yet.</p>
            <Link href="/creator/prompts/new" style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, fontWeight: 600, color: '#FF6B4A' }}>Create your first prompt →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {prompts.slice(0, 6).map((p) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #37324A', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, fontWeight: 600, color: '#EDE9F7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.prompt}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color: STATUS_COLOR[p.status] ?? '#A79FC4', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{p.status}</span>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
