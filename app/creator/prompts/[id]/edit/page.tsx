'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PromptForm, { type PromptFormValues } from '@/components/PromptForm';

const LOCKED_NOTICE: Record<string, string> = {
  pending:   'This prompt is currently under review and cannot be edited.',
  approved:  'This prompt has been approved and is locked from editing.',
  published: 'This prompt is published and cannot be edited.',
};

export default function EditPromptPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [prompt,  setPrompt]  = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/creator/prompts/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setPrompt)
      .catch((status) => status === 404 && setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: PromptFormValues, submitForReview: boolean) => {
    const res = await fetch(`/api/creator/prompts/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...values, submitForReview }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update prompt');
    router.push('/creator/prompts');
  };

  if (loading) return <p style={{ color: '#A79FC4', fontFamily: 'var(--font-sans,sans-serif)', padding: 32 }}>Loading...</p>;
  if (notFound) return <p style={{ color: '#FF6B4A', fontFamily: 'var(--font-sans,sans-serif)', padding: 32 }}>Prompt not found.</p>;

  const isReadonly = !['draft', 'rejected'].includes(prompt?.status);

  return (
    <PromptForm
      initial={prompt}
      rejectionReason={prompt?.status === 'rejected' ? prompt.rejectionReason : undefined}
      readonly={isReadonly}
      readonlyNotice={isReadonly ? LOCKED_NOTICE[prompt?.status] : undefined}
      onSubmit={handleSubmit}
    />
  );
}
