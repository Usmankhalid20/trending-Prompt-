'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Copy, Check, Eye, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PromptDetailsModal from '@/components/PromptDetailsModal';

export default function MySavedPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrompts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            My Saved Prompts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your bookmarked AI prompts for fast access and copy
          </p>
        </div>
        <Link href="/creator/register">
          <Button variant="outline" className="gap-2 font-semibold">
            <Sparkles className="h-4 w-4" />
            Apply as Creator
          </Button>
        </Link>
      </div>

      {/* Prompts Gallery */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading saved prompts...
        </div>
      ) : prompts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-foreground">No prompts found</p>
          <p className="text-xs text-muted-foreground">Explore approved community prompts and bookmark them for quick access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map((p, index) => {
            const id = p._id || p.id;
            return (
              <div
                key={id}
                onClick={() => setSelectedPrompt(p)}
                className="group rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative aspect-16/9 w-full bg-secondary/40 overflow-hidden">
                  <Image
                    src={p.image || '/placeholder-prompt.png'}
                    alt={p.title}
                    fill
                    priority={index < 3}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="secondary" className="text-[10px] font-semibold backdrop-blur-md bg-black/50 text-white border-0">
                      {p.category || 'General'}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 font-mono bg-muted/30 p-2 rounded-md border border-border/40">
                      {p.prompt}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground truncate">
                      By {p.authorName || 'Creator'}
                    </span>
                    <Button
                      size="sm"
                      variant={copiedId === id ? 'default' : 'secondary'}
                      onClick={(e) => handleCopy(id, p.prompt, e)}
                      className="h-7 text-[11px] gap-1 font-semibold shrink-0"
                    >
                      {copiedId === id ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
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
