'use client';

import { useRouter } from 'next/navigation';
import PromptForm, { type PromptFormValues } from '@/components/PromptForm';

export default function NewPromptPage() {
  const router = useRouter();

  const handleSubmit = async (values: PromptFormValues, submitForReview: boolean) => {
    const res = await fetch('/api/creator/prompts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...values, submitForReview }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save prompt');
    router.push('/creator/prompts');
  };

  return <PromptForm onSubmit={handleSubmit} />;
}
