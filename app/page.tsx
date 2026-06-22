'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageGrid from '@/components/ImageGrid';
import PaginationComponent from '@/components/Pagination';
import PromptDetailsModal from '@/components/PromptDetailsModal';
import { Loader2 } from 'lucide-react';

interface Prompt {
  _id?: string;
  id: number;
  title: string;
  image: string;
  prompt: string;
  date: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch('/api/prompts');
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
          setLoadError(null);
        } else {
          const errorData = await res.json().catch(() => null);
          setLoadError(errorData?.message || errorData?.error || 'Could not load prompts right now.');
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setLoadError('Could not load prompts right now. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // Filter and sort prompts
  let filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'oldest') {
    filteredPrompts = [...filteredPrompts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else {
    filteredPrompts = [...filteredPrompts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <main className="px-4 md:px-8 lg:px-12 py-8 min-h-[60vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Discovering trending prompts...</p>
          </div>
        ) : loadError ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-lg font-semibold text-foreground">Unable to load prompts</p>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <ImageGrid 
            prompts={paginatedPrompts}
            onSelectPrompt={setSelectedPrompt}
          />
        ) : (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground">No prompts found matching your search.</p>
          </div>
        )}
      </main>

      {totalPages > 1 && (
        <div className="px-4 md:px-8 lg:px-12 py-12 border-t border-border/50">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {selectedPrompt && (
        <PromptDetailsModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
      
      <footer className="relative mt-8 overflow-hidden border-t border-border/60 bg-gradient-to-b from-secondary/20 via-background to-background">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="space-y-1">
              <p className="text-base font-semibold tracking-wide text-foreground">
                AI Trending Prompts
              </p>
              <p className="text-sm text-muted-foreground">
                Discover, save, and explore AI-generated inspiration in one place.
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground md:items-end">
              <p>&copy; {new Date().getFullYear()} AI Trending Prompts</p>
              <p className="rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                Powered by AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
