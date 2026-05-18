'use client';

import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Prompt {
  _id?: string;
  id: number;
  title: string;
  image: string;
  prompt: string;
  date: string;
}

interface ImageGridProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
}

export default function ImageGrid({ prompts, onSelectPrompt }: ImageGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (e: React.MouseEvent, promptText: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {prompts.map((prompt) => (
        <div
          key={prompt._id}
          className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          onClick={() => onSelectPrompt(prompt)}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
            <Image
              src={prompt.image}
              alt={prompt.title}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <Button
                onClick={(e) => handleCopyPrompt(e, prompt.prompt, prompt._id!)}
                size="sm"
                className={`w-full font-bold shadow-lg transition-all rounded-xl ${
                  copiedId === prompt._id
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
              >
                {copiedId === prompt._id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                {formatDate(prompt.date)}
              </p>
            </div>
            <h3 className="font-bold text-lg text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {prompt.prompt}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

