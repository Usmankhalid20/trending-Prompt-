import AuthForm from '@/components/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — AI Prompt Hub',
  description: 'Sign in to your AI Prompt Hub account.',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
