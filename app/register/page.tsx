import AuthForm from '@/components/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — AI Prompt Hub',
  description: 'Create a free AI Prompt Hub account to save and explore prompts.',
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
