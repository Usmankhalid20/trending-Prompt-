'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Copy,
  Check,
  Eye,
  Sparkles,
  Filter,
  Layers,
  Flame,
  Tag,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PromptDetailsModal from '@/components/PromptDetailsModal';

const CATEGORIES = ['All', 'Couple Portraits', 'Editorial / Dress', 'Fantasy Scenes', 'Architecture', 'Abstract', 'Nature', 'General'];

export default function UserDashboardPage() {
  const [allPrompts, setAllPrompts] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPrompts();
  }, []);

  useEffect(() => {
    filterPromptsByCategory();
  }, [selectedCategory, allPrompts]);

  const fetchAllPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prompts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllPrompts(data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch prompts', e);
    } finally {
      setLoading(false);
    }
  };

  const filterPromptsByCategory = () => {
    if (selectedCategory === 'All') {
      setPrompts(allPrompts);
    } else {
      setPrompts(allPrompts.filter((p) => p.category === selectedCategory));
    }
  };

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate Analytics Stats
  const totalCount = allPrompts.length;

  // Category counts map
  const categoryCountsMap: Record<string, number> = {};
  allPrompts.forEach((p) => {
    const cat = p.category || 'General';
    categoryCountsMap[cat] = (categoryCountsMap[cat] || 0) + 1;
  });

  // Top category
  let topCategoryName = 'General';
  let maxCount = 0;
  Object.entries(categoryCountsMap).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategoryName = cat;
    }
  });

  const activeCategoriesCount = Object.keys(categoryCountsMap).length;

  // Unique creators
  const uniqueCreators = new Set(allPrompts.map((p) => p.authorName || p.userId).filter(Boolean));
  const uniqueCreatorsCount = Math.max(uniqueCreators.size, 1);

  // Top categories list for visual distribution
  const topCategoriesSorted = Object.entries(categoryCountsMap)
    .map(([name, count]) => ({
      name,
      count,
      percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const filteredPrompts = prompts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.prompt?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            User Workspace Dashboard
            <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform analytics, category usage breakdown, and curated AI prompt library
          </p>
        </div>
        <Link href="/creator/register">
          <Button variant="outline" className="gap-2 font-semibold shadow-xs">
            Apply as Creator
          </Button>
        </Link>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Prompts */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total AI Prompts</p>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
          </div>
        </div>

        {/* Card 2: Most Popular Category */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Category</p>
            <p className="text-base font-bold text-foreground truncate">
              {topCategoryName}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">{maxCount} prompts published</p>
          </div>
        </div>

        {/* Card 3: Active Categories */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Categories</p>
            <p className="text-2xl font-black text-foreground">{activeCategoriesCount}</p>
          </div>
        </div>

        {/* Card 4: Community Creators */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prompt Creators</p>
            <p className="text-2xl font-black text-foreground">{uniqueCreatorsCount}</p>
          </div>
        </div>
      </div>

      {/* Category Usage Breakdown Section */}
      {topCategoriesSorted.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Where Prompts Are Used Most (Category Breakdown)
            </h2>
            <span className="text-xs text-muted-foreground font-mono">{totalCount} Prompts Analyzed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            {topCategoriesSorted.map(({ name, count, percent }) => (
              <div key={name} className="p-3.5 rounded-xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">{name}</span>
                  <span className="font-mono text-muted-foreground font-medium">{count} ({percent}%)</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Explorer Header & Search Bar */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Explore Prompts Library</h2>
          <span className="text-xs text-muted-foreground font-mono">{filteredPrompts.length} Showing</span>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts by keyword, subject, style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card border-border/80 rounded-xl"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card text-muted-foreground border border-border/80 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="aspect-4/3 w-full bg-muted/60 animate-pulse rounded-xl" />
              <div className="h-4 w-3/4 bg-muted/60 animate-pulse rounded-xs" />
              <div className="h-3 w-full bg-muted/60 animate-pulse rounded-xs" />
              <div className="h-8 w-full bg-muted/60 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-foreground">No prompts found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((p, index) => {
            const id = p._id || p.id;
            return (
              <div
                key={id}
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
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={p.image || '/placeholder-prompt.png'}
                    alt={p.title}
                    fill
                    priority={index < 3}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-[10px] font-semibold backdrop-blur-md bg-black/50 text-white border-0">
                      {p.category || 'General'}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 font-mono bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      {p.prompt}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground truncate">
                      By {p.authorName || 'Community Creator'}
                    </span>
                    <Button
                      size="sm"
                      variant={copiedId === id ? 'default' : 'secondary'}
                      onClick={(e) => handleCopy(id, p.prompt, e)}
                      className="h-8 text-xs gap-1.5 font-semibold shrink-0"
                    >
                      {copiedId === id ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedPrompt && (
        <PromptDetailsModal
          prompt={selectedPrompt}
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}
