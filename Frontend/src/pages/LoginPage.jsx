import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import { loginUser } from '@/services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError('Please enter your email or username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await loginUser({
        identifier: cleanIdentifier,
        password,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('LOGIN ERROR:', err);

      setError(
        err.response?.data?.message ||
          'Unable to sign in. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[650px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground"
          >
            Design<span className="text-primary">Lens</span>
          </Link>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered design analysis
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Sign in to continue analyzing your designs and reviewing
            your audit history.
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email or Username
              </label>

              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email or username"
                autoComplete="username"
                required
                disabled={loading}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive"
                role="alert"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="gradient"
              className="h-11 w-full rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Trust note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Your account is protected with secure authentication.
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              New to DesignLens?
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register CTA */}
          <Link to="/register" className="block">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl"
            >
              Create an account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to DesignLens
          </Link>
        </div>
      </motion.div>
    </div>
  );
}