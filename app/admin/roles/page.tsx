'use client';

import { useState, useEffect } from 'react';
import { Shield, Save, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function SuperAdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('senior_admin');
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRoleData = () => {
    setLoading(true);
    fetch('/api/admin/roles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.roles)) setRoles(data.roles);
        if (Array.isArray(data.allPermissions)) setAllPermissions(data.allPermissions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  useEffect(() => {
    const r = roles.find((item) => item.key === selectedRoleKey);
    if (r) {
      setActivePermissions(r.permissions || []);
    }
  }, [selectedRoleKey, roles]);

  const togglePermission = (permKey: string) => {
    setActivePermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const res = await fetch('/api/admin/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleKey: selectedRoleKey, permissions: activePermissions }),
    });

    if (res.ok) {
      setMessage(`Permissions for ${selectedRoleKey} saved successfully.`);
      fetchRoleData();
    } else {
      alert('Failed to save permissions');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">Role & Permission Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure granular permissions per administrator role dynamically
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading permission matrix...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Role selector tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-3">
            {['senior_admin', 'content_admin', 'moderator'].map((rk) => (
              <Button
                key={rk}
                variant={selectedRoleKey === rk ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRoleKey(rk)}
                className="capitalize text-xs font-semibold"
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                {rk.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-500">
              <Check className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}

          {/* Permission Group Grid */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground capitalize">
                  {selectedRoleKey.replace('_', ' ')} Permissions
                </h2>
                <p className="text-xs text-muted-foreground">Toggle authorization capabilities</p>
              </div>
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2 font-semibold">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Role Matrix
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allPermissions.map((perm) => {
                const isChecked = activePermissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-muted/20 hover:border-border'
                    }`}
                  >
                    <Checkbox checked={isChecked} onCheckedChange={() => togglePermission(perm.key)} />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{perm.label}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{perm.key}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
