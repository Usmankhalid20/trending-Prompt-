'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PromptDetailsModal from '@/components/PromptDetailsModal';
import { Search, Sparkles, Copy, Check, Filter, Layers, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';

interface PromptItem {
  _id: string;
  title: string;
  prompt: string;
  category?: string;
  aiModel?: string;
  authorName?: string;
  createdAt?: string;
  visible?: boolean;
  image?: string;
}

const AI_MODELS = ['all', 'Midjourney', 'DALL-E 3', 'ChatGPT', 'Stable Diffusion'];
const CATEGORIES = ['all', 'Fantasy', 'Cyberpunk', 'Photorealistic', 'Design', 'Architecture', 'Coding'];

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedModel !== 'all') params.append('aiModel', selectedModel);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [search, selectedModel, selectedCategory]);

  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Artwork Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore AI Image Prompts
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse verified AI artwork prompts. Click any card to preview full details or copy the prompt command with 1-click.
          </p>
        </div>

        {/* Search & Filters Controls */}
        <div className="space-y-4 bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, prompt keywords, style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-background"
            />
          </div>

          {/* Model Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> AI Model:
            </span>
            {AI_MODELS.map((model) => (
              <Button
                key={model}
                variant={selectedModel === model ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedModel(model)}
                className="capitalize text-xs rounded-full h-8"
              >
                {model}
              </Button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Layers className="h-3 w-3" /> Style:
            </span>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize text-xs rounded-full h-7"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompt Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-card overflow-hidden space-y-3 p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-border bg-card p-12 space-y-3">
            <p className="text-base font-semibold text-foreground">No prompts found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search terms or filter selections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((p) => (
              <div
                key={p._id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPrompt(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPrompt(p);
                  }
                }}
                aria-label={`View details for prompt ${p.title}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/30">
                  <Image
                    src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'}
                    alt={p.title}
                    fill
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                      {p.aiModel || 'Midjourney'}
                    </Badge>
                    {p.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* Floating Prompt Preview on Hover */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary-foreground transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-300 line-clamp-2 leading-relaxed">
                      {p.prompt}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-card border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] truncate">
                    By {p.authorName || 'Community Member'}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => handleCopy(e, p._id, p.prompt)}
                    className={`h-8 font-bold gap-1.5 transition-all text-xs ${
                      copiedId === p._id
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    {copiedId === p._id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedPrompt && (
        <PromptDetailsModal
          prompt={selectedPrompt as any}
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}

      <Footer />
    </div>
  );
}
