'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, FolderPlus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setName('');
      setDescription('');
      fetchCategories();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to create category');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Organize prompts into structured, searchable categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category Creation Form */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-primary" />
            Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Category Name</label>
              <Input
                placeholder="e.g. System Engineering"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Input
                placeholder="Brief summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Active Categories ({categories.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No categories created yet.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {categories.map((c) => (
                <div key={c._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">slug: <code className="font-mono text-[11px]">{c.slug}</code></p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(c._id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
