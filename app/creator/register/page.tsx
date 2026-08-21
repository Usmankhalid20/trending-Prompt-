import AuthForm from '@/components/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Creator — AI Prompt Hub',
  description: 'Create a creator account to submit AI image prompts for community review.',
};

export default function CreatorRegisterPage() {
  return <AuthForm mode="creator-register" />;
}
