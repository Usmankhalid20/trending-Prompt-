'use client';

import { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, Trash2, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleStatusChange = async (userId: string, action: 'suspend' | 'activate') => {
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });
    if (res.ok) fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View registered community members, suspend offending accounts, or restore access
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading user records...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No user accounts found.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground text-sm">{u.name}</p>
                      <p className="text-muted-foreground text-[11px]">{u.email}</p>
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={u.status === 'active' ? 'default' : 'destructive'}
                        className="capitalize text-[10px]"
                      >
                        {u.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(u._id, 'suspend')}
                            className="h-8 gap-1 text-xs text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/30"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(u._id, 'activate')}
                            className="h-8 gap-1 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Restore
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(u._id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
    </div>
  );
}
