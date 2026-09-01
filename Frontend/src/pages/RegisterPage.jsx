import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

import { registerUser } from '@/services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const passwordChecks = [
    {
      valid: passwordRequirements.minLength,
      text: 'At least 8 characters',
    },
    {
      valid: passwordRequirements.hasUpperCase,
      text: 'One uppercase letter',
    },
    {
      valid: passwordRequirements.hasLowerCase,
      text: 'One lowercase letter',
    },
    {
      valid: passwordRequirements.hasNumber,
      text: 'One number',
    },
  ];

  const passwordsMatch =
    Boolean(formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  const isPasswordValid =
    Object.values(passwordRequirements).every(Boolean);

  const isFormValid =
    Boolean(formData.username.trim()) &&
    Boolean(formData.email.trim()) &&
    isPasswordValid &&
    passwordsMatch &&
    agreeTerms;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username || !email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy.'
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username,
        email,
        password: formData.password,
      });

      navigate('/login', {
        state: {
          registered: true,
        },
      });
    } catch (err) {
      console.error('REGISTER ERROR:', err);

      setError(
        err.response?.data?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-8 text-center"
          >
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
              Create your account
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Join DesignLens to analyze your designs and get actionable
              AI-powered feedback.
            </p>
          </motion.div>

          {/* Register card */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-border bg-card/95 shadow-xl backdrop-blur">
              <CardHeader className="space-y-2 p-6 pb-4 sm:p-7 sm:pb-5">
                <CardTitle className="text-xl">
                  Get started
                </CardTitle>

                <CardDescription className="leading-5">
                  Create your account to start auditing website designs.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 sm:p-7 sm:pt-3">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive"
                      role="alert"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Username */}
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        disabled={loading}
                        required
                        className="h-11 rounded-xl pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={loading}
                        required
                        className="h-11 rounded-xl pl-10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                        className="h-11 rounded-xl pl-10 pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password requirements */}
                  {formData.password && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
                      className="rounded-xl border border-border bg-secondary/40 p-4"
                    >
                      <p className="mb-3 text-xs font-semibold text-foreground">
                        Password requirements
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {passwordChecks.map((requirement) => (
                          <div
                            key={requirement.text}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                requirement.valid
                                  ? 'bg-success/10'
                                  : 'bg-muted'
                              }`}
                            >
                              {requirement.valid ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <X className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>

                            <span
                              className={`text-xs ${
                                requirement.valid
                                  ? 'text-success'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {requirement.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                        className={`h-11 rounded-xl pl-10 pr-10 ${
                          formData.confirmPassword &&
                          !passwordsMatch
                            ? 'border-destructive focus:border-destructive'
                            : ''
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {formData.confirmPassword &&
                      !passwordsMatch && (
                        <p className="text-xs text-destructive">
                          Passwords do not match.
                        </p>
                      )}

                    {passwordsMatch && (
                      <p className="flex items-center gap-1 text-xs text-success">
                        <Check className="h-3 w-3" />
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) =>
                        setAgreeTerms(
                          e.target.checked
                        )
                      }
                      disabled={loading}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input bg-background accent-primary disabled:cursor-not-allowed"
                    />

                    <span className="text-xs leading-5 text-muted-foreground">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) =>
                          e.preventDefault()
                        }
                        className="font-medium text-primary"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) =>
                          e.preventDefault()
                        }
                        className="font-medium text-primary"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="h-11 w-full rounded-xl"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust note */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Your account information is securely handled.
                </div>

                {/* Sign in */}
                <div className="mt-6 border-t border-border pt-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-primary transition-colors hover:text-primary/90"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to DesignLens
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}