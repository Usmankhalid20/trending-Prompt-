'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Loader2, AlertCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['Couple Portraits', 'Editorial / Dress', 'Fantasy Scenes', 'Architecture', 'Abstract', 'Nature', 'General'];

export interface PromptFormValues {
  title:       string;
  prompt:      string;
  description: string;
  category:    string;
  tags:        string;  // comma-separated
  image:       string;  // Image URL or Base64
}

interface PromptFormProps {
  /** populated when editing an existing prompt */
  initial?:         Partial<PromptFormValues>;
  /** 'rejected' prompt to resubmit */
  rejectionReason?: string;
  /** callback receives values + whether to submit for review */
  onSubmit:         (values: PromptFormValues, submitForReview: boolean) => Promise<void>;
  backHref?:        string;
  /** hide the "Resubmit" / "Submit" button when viewing non-editable prompts */
  readonly?:        boolean;
  readonlyNotice?:  string;
}

export default function PromptForm({
  initial = {},
  rejectionReason,
  onSubmit,
  backHref = '/creator/prompts',
  readonly,
  readonlyNotice,
}: PromptFormProps) {
  const [values, setValues] = useState<PromptFormValues>({
    title:       initial.title       ?? '',
    prompt:      initial.prompt      ?? '',
    description: initial.description ?? '',
    category:    initial.category    ?? 'General',
    tags:        Array.isArray((initial as any).tags) ? (initial as any).tags.join(', ') : (initial.tags ?? ''),
    image:       initial.image       ?? '',
  });
  const [loading, setLoading]       = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const set = (key: keyof PromptFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setValues((v) => ({ ...v, image: data.url }));
          return;
        }
      }

      // Fallback to FileReader base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setValues((v) => ({ ...v, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setValues((v) => ({ ...v, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (submitForReview: boolean) => {
    if (!values.title.trim() || !values.prompt.trim()) {
      setError('Title and prompt content are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values, submitForReview);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link href={backHref}>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            {initial.title ? 'Edit Prompt' : 'Create Prompt'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload sample artwork, save as draft, or submit for admin review.
          </p>
        </div>
      </div>

      {/* Rejection notice */}
      {rejectionReason && (
        <div className="flex gap-3 bg-destructive/10 border border-destructive/25 rounded-xl p-4 text-xs">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mono font-semibold text-destructive uppercase tracking-wider text-[10px]">
              REJECTION REASON
            </p>
            <p className="text-foreground">{rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Read-only notice */}
      {readonlyNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-400">
          {readonlyNotice}
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="pf-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Title
          </label>
          <Input
            id="pf-title"
            placeholder="e.g. Twilight Couple Portrait"
            value={values.title}
            onChange={set('title')}
            disabled={readonly}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="pf-cat" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Category
          </label>
          <select
            id="pf-cat"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            value={values.category}
            onChange={set('category')}
            disabled={readonly}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Prompt Sample Artwork Image
          </label>
          {values.image ? (
            <div className="relative w-full max-h-72 rounded-xl overflow-hidden border border-border bg-background flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={values.image} alt="Prompt Artwork Preview" className="max-h-72 object-contain w-full" />
              {!readonly && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setValues((v) => ({ ...v, image: '' }))}
                  className="absolute top-3 right-3 gap-1.5 shadow-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Image
                </Button>
              )}
            </div>
          ) : (
            <div className="relative">
              <label
                htmlFor="pf-image-file"
                className={`flex flex-col items-center justify-center gap-2.5 p-8 rounded-xl border-2 border-dashed border-border/80 bg-background/50 transition-colors ${
                  readonly || uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary/50'
                }`}
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center border border-border">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {uploading ? 'Uploading image...' : 'Click or Drag image to upload artwork sample'}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    Supports PNG, JPG, WEBP, GIF
                  </p>
                </div>
              </label>
              {!readonly && (
                <input
                  id="pf-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              )}
            </div>
          )}
        </div>

        {/* Prompt Content Payload */}
        <div className="space-y-2">
          <label htmlFor="pf-prompt" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Prompt Content Payload
          </label>
          <Textarea
            id="pf-prompt"
            rows={5}
            className="font-mono text-xs leading-relaxed"
            placeholder="/imagine prompt: cinematic twilight couple portrait, golden hour backlight --ar 16:9 --v 6 --stylize 750"
            value={values.prompt}
            onChange={set('prompt')}
            disabled={readonly}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="pf-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Description <span className="text-muted-foreground/60 font-normal lowercase">(optional)</span>
          </label>
          <Textarea
            id="pf-desc"
            rows={3}
            placeholder="Brief description of the visual style or mood..."
            value={values.description}
            onChange={set('description')}
            disabled={readonly}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="pf-tags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Tags <span className="text-muted-foreground/60 font-normal lowercase">(comma-separated)</span>
          </label>
          <Input
            id="pf-tags"
            placeholder="portrait, couple, golden hour"
            value={values.tags}
            onChange={set('tags')}
            disabled={readonly}
          />
        </div>
      </div>

      {/* Form Action Controls */}
      {!readonly && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAction(false)}
            disabled={loading || uploading}
            className="gap-2 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>

          <Button
            type="button"
            onClick={() => handleAction(true)}
            disabled={loading || uploading}
            className="gap-2 font-semibold shadow-xs"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {initial.title ? 'Resubmit for Review' : 'Submit for Review'}
          </Button>
        </div>
      )}
    </div>
  );
}
