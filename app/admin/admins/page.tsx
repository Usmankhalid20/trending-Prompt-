'use client';

import { useState, useEffect } from 'react';
import { UserPlus, ShieldCheck, UserX, UserCheck, Trash2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('senior_admin');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    fetch('/api/admin/admins')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAdmins(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchAdmins();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to create admin');
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (adminId: string, status: 'active' | 'suspended') => {
    const res = await fetch('/api/admin/admins', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, status }),
    });
    if (res.ok) fetchAdmins();
    else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this administrator account?')) return;
    const res = await fetch(`/api/admin/admins?id=${adminId}`, { method: 'DELETE' });
    if (res.ok) fetchAdmins();
    else {
      const err = await res.json();
      alert(err.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administrator Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create administrators, assign dynamic roles, reset passwords, or manage access
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 font-semibold shadow-xs">
          <UserPlus className="h-4 w-4" />
          Create Admin Account
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading administrator accounts...
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {admins.map((a) => (
                  <tr key={a._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground text-sm">{a.name}</p>
                      <p className="text-muted-foreground text-[11px]">{a.email}</p>
                    </td>

                    <td className="p-4">
                      <Badge variant="outline" className="capitalize text-[10px] font-mono">
                        {a.role.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={a.status === 'active' ? 'default' : 'destructive'}
                        className="capitalize text-[10px]"
                      >
                        {a.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      {a.role === 'super_admin' ? (
                        <span className="text-[11px] font-semibold text-muted-foreground">System Protected</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(a._id, 'suspended')}
                              className="h-8 gap-1 text-xs text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/30"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(a._id, 'active')}
                              className="h-8 gap-1 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Restore
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(a._id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create New Administrator</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAdmin} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Admin Full Name</label>
              <Input
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <Input
                type="email"
                required
                placeholder="admin@aiprompthub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Initial Password</label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Assigned Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior_admin">Senior Admin</SelectItem>
                  <SelectItem value="content_admin">Content Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="font-semibold">
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
