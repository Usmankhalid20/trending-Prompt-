'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Loader2, AlertCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

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

      // Fallback to FileReader base64 if server upload endpoint fails or Cloudinary is unset
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setValues((v) => ({ ...v, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      // FileReader fallback
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

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#14121A', border: '1px solid #37324A',
    borderRadius: 8, padding: '9px 12px', color: '#EDE9F7',
    fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-mono,monospace)', fontSize: 11,
    fontWeight: 600, letterSpacing: '0.08em', color: '#A79FC4',
    marginBottom: 6, textTransform: 'uppercase',
  };

  return (
    <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back + heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href={backHref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #37324A', color: '#A79FC4', textDecoration: 'none', flexShrink: 0 }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: '#EDE9F7', margin: 0 }}>
            {initial.title ? 'Edit Prompt' : 'Create Prompt'}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#A79FC4', margin: '3px 0 0' }}>
            Upload sample artwork, save as draft, or submit for admin review.
          </p>
        </div>
      </div>

      {/* Rejection notice */}
      {rejectionReason && (
        <div style={{ display: 'flex', gap: 10, background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.25)', borderRadius: 10, padding: '12px 16px' }}>
          <AlertCircle size={16} color="#FF6B4A" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color: '#FF6B4A', margin: '0 0 4px', letterSpacing: '0.06em' }}>REJECTION REASON</p>
            <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#EDE9F7', margin: 0 }}>{rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Read-only notice */}
      {readonlyNotice && (
        <div style={{ background: 'rgba(131,230,201,0.07)', border: '1px solid rgba(131,230,201,0.2)', borderRadius: 10, padding: '12px 16px' }}>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#83E6C9', margin: 0 }}>{readonlyNotice}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 10, padding: '12px 16px' }}>
          <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 13, color: '#FF6B4A', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Form card */}
      <div style={{ background: '#1D1926', border: '1px solid #37324A', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Title */}
        <div>
          <label htmlFor="pf-title" style={labelStyle}>Title</label>
          <input id="pf-title" style={inputStyle} placeholder="e.g. Twilight Couple Portrait" value={values.title} onChange={set('title')} disabled={readonly} required />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="pf-cat" style={labelStyle}>Category</label>
          <select id="pf-cat" style={{ ...inputStyle, appearance: 'none' }} value={values.category} onChange={set('category')} disabled={readonly}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Image Upload Field */}
        <div>
          <label style={labelStyle}>Prompt Sample Artwork Image</label>
          {values.image ? (
            <div style={{ position: 'relative', width: '100%', maxHeight: 280, borderRadius: 10, overflow: 'hidden', border: '1px solid #37324A', background: '#14121A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={values.image} alt="Prompt Artwork Preview" style={{ width: '100%', maxHeight: 280, objectFit: 'contain' }} />
              {!readonly && (
                <button
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, image: '' }))}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: 6,
                    padding: 8, cursor: 'pointer', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: 'var(--font-sans,sans-serif)', fontSize: 12, fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  <Trash2 size={14} />
                  Remove Image
                </button>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <label
                htmlFor="pf-image-file"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '32px 20px', borderRadius: 10, border: '2px dashed #37324A', background: '#14121A',
                  cursor: readonly || uploading ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {uploading ? (
                  <Loader2 size={24} className="animate-spin" style={{ color: '#FF6B4A' }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#262131', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #37324A' }}>
                    <Upload size={20} color="#FF6B4A" />
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-sans,sans-serif)', fontSize: 14, fontWeight: 600, color: '#EDE9F7', margin: '0 0 2px 0' }}>
                    {uploading ? 'Uploading image...' : 'Click or Drag image to upload artwork sample'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: '#A79FC4', margin: 0 }}>
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
                  style={{ display: 'none' }}
                />
              )}
            </div>
          )}
        </div>

        {/* Prompt content */}
        <div>
          <label htmlFor="pf-prompt" style={labelStyle}>Prompt Content</label>
          <textarea
            id="pf-prompt"
            rows={6}
            style={{ ...inputStyle, fontFamily: 'var(--font-mono,monospace)', fontSize: 12, lineHeight: 1.6, resize: 'vertical' }}
            placeholder="/imagine prompt: cinematic twilight couple portrait, golden hour backlight --ar 16:9 --v 6 --stylize 750"
            value={values.prompt}
            onChange={set('prompt')}
            disabled={readonly}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="pf-desc" style={labelStyle}>Description <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
          <textarea id="pf-desc" rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief description of the style or mood..." value={values.description} onChange={set('description')} disabled={readonly} />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="pf-tags" style={labelStyle}>Tags <span style={{ fontWeight: 400, textTransform: 'none' }}>(comma-separated)</span></label>
          <input id="pf-tags" style={inputStyle} placeholder="portrait, couple, golden hour" value={values.tags} onChange={set('tags')} disabled={readonly} />
        </div>
      </div>

      {/* Actions */}
      {!readonly && (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleAction(false)}
            disabled={loading || uploading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans,sans-serif)', fontWeight: 600, fontSize: 14,
              padding: '9px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: '1px solid #37324A', color: '#A79FC4',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleAction(true)}
            disabled={loading || uploading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans,sans-serif)', fontWeight: 600, fontSize: 14,
              padding: '9px 20px', borderRadius: 8, cursor: 'pointer',
              background: '#FF6B4A', border: 'none', color: '#14121A',
              transition: 'background 0.15s',
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {initial.title ? 'Resubmit for Review' : 'Submit for Review'}
          </button>
        </div>
      )}
    </div>
  );
}
