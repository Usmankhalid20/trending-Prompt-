'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, User, Loader2, Sparkles, Wand2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Mode = 'login' | 'register' | 'creator-register';

interface AuthFormProps {
  mode: Mode;
}

const CONFIG = {
  login: {
    heading: 'Welcome back',
    sub: 'Sign in to access your User Portal, Creator Studio, or Admin Dashboard',
    cta: 'Sign In',
    switchText: "Don't have an account?",
    switchLabel: 'Create user account',
    switchHref: '/register',
    apiPath: '/api/auth/login',
  },
  register: {
    heading: 'Create User Account',
    sub: 'Browse, save, and manage your favorite AI prompts',
    cta: 'Create User Account',
    switchText: 'Already have an account?',
    switchLabel: 'Sign In',
    switchHref: '/login',
    apiPath: '/api/auth/register',
  },
  'creator-register': {
    heading: 'Create Creator Account',
    sub: 'Submit AI prompts, get reviewed by admins, and publish to the community',
    cta: 'Create Creator Account',
    switchText: 'Already have an account?',
    switchLabel: 'Sign In',
    switchHref: '/login',
    apiPath: '/api/auth/register',
  },
} satisfies Record<Mode, object>;

/** Role redirect map — matches API login response */
const ROLE_REDIRECT: Record<string, string> = {
  user:          '/dashboard',
  creator:       '/creator',
  admin:         '/admin',
  super_admin:   '/admin',
  senior_admin:  '/admin',
  content_admin: '/admin',
  moderator:     '/admin',
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router   = useRouter();
  const cfg      = CONFIG[mode];
  const isLogin  = mode === 'login';
  const isRegister = mode !== 'login';
  const isCreatorMode = mode === 'creator-register';

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string> = { email, password };
      if (isRegister) body.name = name;
      if (isCreatorMode) body.role = 'creator';

      const res  = await fetch(cfg.apiPath, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      const role    = data.user?.role ?? 'user';
      const redirect = ROLE_REDIRECT[role] ?? '/dashboard';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg,#FF6B4A,#e85a39)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </span>
            <span className="font-bold text-xl tracking-tight text-foreground font-display">
              AI Prompt Hub
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{cfg.heading}</h1>
          <p className="text-sm text-muted-foreground">{cfg.sub}</p>
        </div>

        {/* Account Type Selector Switcher (shown during Registration) */}
        {isRegister && (
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-card border border-border/80">
            <Link
              href="/register"
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                !isCreatorMode
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Regular User
            </Link>
            <Link
              href="/creator/register"
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                isCreatorMode
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Prompt Creator
            </Link>
          </div>
        )}

        {/* Single Login Notice */}
        {isLogin && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong className="text-foreground font-semibold">Universal Login:</strong> Enter your email & password. You will be automatically routed to your <strong>User Portal</strong>, <strong>Creator Studio</strong>, or <strong>Admin Dashboard</strong> based on your account role.
            </span>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm space-y-5">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name — register only */}
            {isRegister && (
              <div className="space-y-2">
                <label htmlFor="auth-name" className="text-xs font-semibold text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="auth-email" className="text-xs font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="auth-password" className="text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="auth-password"
                  type="password"
                  required
                  minLength={isRegister ? 6 : undefined}
                  placeholder={isRegister ? 'Minimum 6 characters' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full font-semibold gap-2 shadow-xs">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {cfg.cta}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <div className="space-y-2 text-center text-xs text-muted-foreground">
          <p>
            {cfg.switchText}{' '}
            <Link href={cfg.switchHref} className="font-semibold text-primary hover:underline">
              {cfg.switchLabel}
            </Link>
          </p>

          {isLogin && (
            <p>
              Want to create and submit AI prompts?{' '}
              <Link href="/creator/register" className="font-semibold text-primary hover:underline">
                Join as a Creator
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
