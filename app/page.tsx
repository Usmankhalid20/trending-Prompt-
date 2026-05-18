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
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
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
      
      {/* Premium Footer */}
      <footer className="border-t border-border/50 py-12 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Trending Prompts. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
