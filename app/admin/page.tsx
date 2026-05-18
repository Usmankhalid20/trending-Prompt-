'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/AdminSidebar';
import PromptsTable from '@/components/PromptsTable';
import AddPromptModal from '@/components/AddPromptModal';
import { toast } from 'sonner';

interface Prompt {
  _id?: string;
  id: number;
  title: string;
  image: string;
  prompt: string;
  date: string;
  visible: boolean;
}

export default function AdminPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'manage'>('manage');
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authRes = await fetch('/api/auth/check');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }

        const promptsRes = await fetch('/api/prompts/admin'); // I'll create this or use a query param
        // Actually I'll just use /api/prompts and filter on server if needed, 
        // but for admin I want ALL prompts. I'll update the API route to handle this.
        const res = await fetch('/api/prompts?all=true');
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const prompt = prompts.find((p) => p._id === id);
    if (!prompt) return;

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !prompt.visible }),
      });

      if (res.ok) {
        setPrompts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, visible: !p.visible } : p))
        );
        toast.success('Visibility updated');
      }
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPrompts((prev) => prev.filter((p) => p._id !== id));
        toast.success('Prompt deleted');
      }
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowAddModal(true);
  };

  const handleSavePrompt = async (data: Omit<Prompt, 'id'>) => {
    try {
      if (editingPrompt?._id) {
        // Update
        const res = await fetch(`/api/prompts/${editingPrompt._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setPrompts((prev) =>
            prev.map((p) =>
              p._id === editingPrompt._id ? { ...data, _id: editingPrompt._id, id: p.id } : p
            )
          );
          toast.success('Prompt updated');
        }
      } else {
        // Create
        const res = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id: Date.now() }), // temporary id
        });

        if (res.ok) {
          const newPrompt = await res.json();
          setPrompts((prev) => [newPrompt, ...prev]);
          toast.success('Prompt added');
        }
      }
      setShowAddModal(false);
      setEditingPrompt(null);
    } catch (error) {
      toast.error('Failed to save prompt');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === 'dashboard' ? 'Dashboard' : 'Manage Prompts'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'dashboard'
                  ? 'Overview and statistics'
                  : 'Edit, delete, and organize your AI prompts'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'manage' && (
                <Button
                  onClick={() => {
                    setEditingPrompt(null);
                    setShowAddModal(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Prompt
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-border hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Total Prompts</p>
                <p className="text-5xl font-bold text-foreground tracking-tight">{prompts.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-green-500">
                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Visible Prompts</p>
                <p className="text-5xl font-bold text-green-600 tracking-tight">
                  {prompts.filter((p) => p.visible).length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-orange-500">
                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Hidden Prompts</p>
                <p className="text-5xl font-bold text-orange-500 tracking-tight">
                  {prompts.filter((p) => !p.visible).length}
                </p>
              </div>
            </div>
          ) : (
            <PromptsTable
              prompts={prompts}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDeletePrompt}
              onEdit={handleEditPrompt}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Prompt Modal */}
      {showAddModal && (
        <AddPromptModal
          prompt={editingPrompt}
          onClose={() => {
            setShowAddModal(false);
            setEditingPrompt(null);
          }}
          onSave={handleSavePrompt}
        />
      )}
    </div>
  );
}
