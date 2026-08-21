'use client';

import { useState } from 'react';
import { X, Copy, CheckCircle2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Prompt {
  _id?: string;
  id?: number;
  title: string;
  image?: string;
  prompt: string;
  date?: string;
  createdAt?: string | Date;
  aiModel?: string;
  category?: string;
  authorName?: string;
}

interface PromptDetailsModalProps {
  prompt: Prompt;
  isOpen?: boolean;
  onClose: () => void;
}

export default function PromptDetailsModal({ prompt, isOpen = true, onClose }: PromptDetailsModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (isOpen === false) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl scale-in-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all hover:rotate-90 text-white md:text-foreground md:bg-secondary/50 md:hover:bg-secondary"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side - Image */}
        <div className="flex-1 bg-secondary/30 min-h-[300px] md:min-h-full relative overflow-hidden">
          <Image
            src={prompt.image || '/placeholder-prompt.png'}
            alt={prompt.title}
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 p-8 md:p-12 flex flex-col gap-8 overflow-y-auto bg-card">
          {/* Header */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
              Featured Prompt
            </p>
            <h2 className="text-4xl font-black text-foreground tracking-tight leading-tight">
              {prompt.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Added {formatDate(prompt.date || String(prompt.createdAt || ''))}
            </div>
          </div>

          {/* Prompt Text Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                Prompt Command
              </label>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded">
                Ready to Copy
              </span>
            </div>
            <div className="bg-secondary/40 rounded-2xl p-6 border border-border min-h-[160px] relative group">
              <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap font-medium">
                {prompt.prompt}
              </p>
            </div>
          </div>

          {/* Pro Tip Callout */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-1">
                Optimized for Excellence
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This prompt is engineered for high-fidelity outputs. For best results, use with Gemini Advanced or latest DALL-E models.
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyPrompt}
            size="lg"
            className={`w-full h-14 text-lg font-black transition-all rounded-2xl shadow-xl active:scale-[0.98] ${
              isCopied
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
            }`}
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-6 h-6 mr-3" />
                Prompt Copied!
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 mr-3" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
