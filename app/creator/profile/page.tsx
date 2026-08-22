'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
      setSuccess('Profile updated successfully.');
      setForm((f) => ({ ...f, currentPw: '', newPw: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fetched) {
    return (
      <div className="py-12 flex items-center justify-center text-sm font-medium text-muted-foreground gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">Creator Profile</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your personal account details and authentication credentials.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-500 font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 text-xs text-destructive font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="font-display font-semibold text-base text-foreground pb-3 border-b border-border">
            Basic Details
          </h2>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Full Name
            </label>
            <Input value={form.name} onChange={set('name')} required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Email Address
            </label>
            <Input value={form.email} disabled className="opacity-60 cursor-not-allowed bg-muted/30" />
            <p className="text-[11px] text-muted-foreground">Account email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Bio <span className="text-muted-foreground/60 font-normal lowercase">(optional)</span>
            </label>
            <Textarea
              rows={3}
              placeholder="A short bio about your work as a prompt creator..."
              value={form.bio}
              onChange={set('bio')}
            />
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="font-display font-semibold text-base text-foreground pb-3 border-b border-border">
            Change Password
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Required to change password"
              value={form.currentPw}
              onChange={set('currentPw')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.newPw}
              onChange={set('newPw')}
            />
          </div>
        </div>

        {/* Save Action */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="gap-2 font-semibold shadow-xs">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
