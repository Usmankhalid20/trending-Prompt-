'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('AI Prompt Hub');
  const [requireAdminApproval, setRequireAdminApproval] = useState(true);
  const [allowPublicRegistration, setAllowPublicRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName);
        if (typeof data.requireAdminApproval === 'boolean') setRequireAdminApproval(data.requireAdminApproval);
        if (typeof data.allowPublicRegistration === 'boolean') setAllowPublicRegistration(data.allowPublicRegistration);
        if (typeof data.maintenanceMode === 'boolean') setMaintenanceMode(data.maintenanceMode);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteName,
        requireAdminApproval,
        allowPublicRegistration,
        maintenanceMode,
      }),
    });

    if (res.ok) {
      setMessage('Platform settings updated successfully.');
    } else {
      alert('Failed to save platform settings');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Global platform operational controls and registration rules
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-500">
          <Check className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading platform configuration...
        </div>
      ) : (
        <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Platform Title / Brand Name</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
          </div>

          <div className="divide-y divide-border/60">
            
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Require Admin Approval</p>
                <p className="text-xs text-muted-foreground">User submitted prompts require admin review before being published publicly</p>
              </div>
              <Switch checked={requireAdminApproval} onCheckedChange={setRequireAdminApproval} />
            </div>

            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Allow Public Registration</p>
                <p className="text-xs text-muted-foreground">Allow visitors to register new accounts via /register</p>
              </div>
              <Switch checked={allowPublicRegistration} onCheckedChange={setAllowPublicRegistration} />
            </div>

            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground text-amber-500">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Temporarily restrict user access for maintenance</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

          </div>

          <Button type="submit" disabled={saving} className="gap-2 font-semibold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Platform Settings
          </Button>
        </form>
      )}
    </div>
  );
}
