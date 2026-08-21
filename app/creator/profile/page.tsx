'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';

export default function CreatorProfilePage() {
  const [form,    setForm]    = useState({ name: '', email: '', bio: '', currentPw: '', newPw: '' });
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setForm((f) => ({ ...f, name: d.user.name, email: d.user.email, bio: d.user.bio ?? '' }));
        setFetched(true);
      });
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/user/profile', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          currentPassword: form.currentPw || undefined,
          newPassword:     form.newPw     || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setSuccess('Profile updated.');
      setForm((f) => ({ ...f, currentPw: '', newPw: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#14121A', border: '1px solid #37324A',
    borderRadius: 8, padding: '9px 12px', color: '#EDE9F7',
    fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-mono,monospace)', fontSize: 11,
    fontWeight: 600, letterSpacing: '0.08em', color: '#A79FC4',
    marginBottom: 6, textTransform: 'uppercase',
  };
  const sectionStyle: React.CSSProperties = {
    background: '#1D1926', border: '1px solid #37324A', borderRadius: 14, padding: 24,
    display: 'flex', flexDirection: 'column', gap: 18,
  };

  if (!fetched) return <p style={{ color: '#A79FC4', fontFamily: 'var(--font-sans,sans-serif)', padding: 32 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, color: '#EDE9F7', margin: 0 }}>Profile</h1>
        <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#A79FC4', margin: '4px 0 0' }}>Manage your creator account details.</p>
      </div>

      {success && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(131,230,201,0.08)', border: '1px solid rgba(131,230,201,0.2)', borderRadius: 10, padding: '10px 14px' }}>
          <CheckCircle2 size={14} color="#83E6C9" />
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#83E6C9', margin: 0 }}>{success}</p>
        </div>
      )}
      {error && (
        <div style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#FF6B4A', margin: 0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic info */}
        <div style={sectionStyle}>
          <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: '#EDE9F7', margin: 0, paddingBottom: 12, borderBottom: '1px solid #37324A' }}>Basic Details</p>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, opacity: 0.5 }} value={form.email} disabled />
            <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 12, color: '#A79FC4', margin: '5px 0 0' }}>Email cannot be changed.</p>
          </div>
          <div>
            <label style={labelStyle}>Bio <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="A short bio about your work..." value={form.bio} onChange={set('bio')} />
          </div>
        </div>

        {/* Password */}
        <div style={sectionStyle}>
          <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: '#EDE9F7', margin: 0, paddingBottom: 12, borderBottom: '1px solid #37324A' }}>Change Password</p>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input type="password" style={inputStyle} placeholder="Required to change password" value={form.currentPw} onChange={set('currentPw')} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" style={inputStyle} placeholder="Minimum 6 characters" value={form.newPw} onChange={set('newPw')} />
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans,sans-serif)', fontWeight: 600, fontSize: 14,
              padding: '9px 20px', borderRadius: 8, cursor: 'pointer',
              background: '#FF6B4A', border: 'none', color: '#14121A',
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
