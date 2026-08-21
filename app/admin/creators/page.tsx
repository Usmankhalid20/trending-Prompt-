'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, UserX, UserCheck, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchCreators = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);

    fetch(`/api/admin/creators?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCreators(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreators();
  }, [search, statusFilter]);

  const handleAction = async (creatorId: string, action: 'approve' | 'reject' | 'suspend' | 'activate') => {
    const res = await fetch('/api/admin/creators', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, action }),
    });

    if (res.ok) {
      fetchCreators();
    } else {
      const err = await res.json();
      alert(err.error || 'Action failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 gap-1 text-[10px]">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case 'approved':
      case 'active':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1 text-[10px]">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/30 gap-1 text-[10px]">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1 text-[10px]">
            <ShieldAlert className="w-3 h-3" />
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="capitalize text-[10px]">{status}</Badge>;
    }
  };

  const statusTabs = [
    { key: 'all', label: 'All Creators' },
    { key: 'pending', label: 'Pending Approval' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">Creator Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review registration applications, approve studio access, and manage creator account statuses.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 border border-border rounded-lg">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-card text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creator name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading creator applications...
        </div>
      ) : creators.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No creator accounts found matching current filters.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {creators.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground text-sm">{c.name}</p>
                      <p className="text-muted-foreground text-[11px] font-mono">{c.email}</p>
                    </td>

                    <td className="p-4">{getStatusBadge(c.status)}</td>

                    <td className="p-4 text-muted-foreground">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(c._id, 'approve')}
                              className="h-8 gap-1 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(c._id, 'reject')}
                              className="h-8 gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </>
                        )}

                        {(c.status === 'approved' || c.status === 'active') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(c._id, 'suspend')}
                            className="h-8 gap-1 text-xs text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/30"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Suspend
                          </Button>
                        )}

                        {c.status === 'rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(c._id, 'approve')}
                            className="h-8 gap-1 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve Access
                          </Button>
                        )}

                        {c.status === 'suspended' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(c._id, 'activate')}
                            className="h-8 gap-1 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Restore Access
                          </Button>
                        )}
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
