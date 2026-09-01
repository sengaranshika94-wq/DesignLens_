import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  ShieldCheck,
  Check,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ThemeSelector } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

import { updateProfile } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;

    setUsername(user.username || '');
    setEmail(user.email || '');
  }, [user]);

  const initials =
    username.trim().slice(0, 2).toUpperCase() || 'U';

  const hasChanges =
    username.trim() !== (user?.username || '') ||
    email.trim() !== (user?.email || '');

  const handleSaveProfile = async () => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    setError('');
    setSuccess('');

    if (!cleanUsername || !cleanEmail) {
      setError('Username and email are required.');
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile({
        username: cleanUsername,
        email: cleanEmail,
      });

      if (!data?.user) {
        throw new Error('Updated user data was not returned.');
      }

      // Update global auth state
      setUser(data.user);

      // Keep local form state in sync
      setUsername(data.user.username);
      setEmail(data.user.email);

      setSuccess('Profile updated successfully.');

      window.setTimeout(() => {
        setSuccess('');
      }, 2500);
    } catch (err) {
      console.error('PROFILE UPDATE ERROR:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Account
        </div>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Manage your account, appearance, and notification preferences.
        </p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your DesignLens account information.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {!user ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Unable to load your account information.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-400 text-lg font-bold text-white shadow-sm">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {username || 'User'}
                      </p>

                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {email || 'No email available'}
                      </p>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Success */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success"
                      role="status"
                    >
                      <Check className="h-4 w-4" />
                      {success}
                    </motion.div>
                  )}

                  {/* Inputs */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="settings-username"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Username
                      </label>

                      <Input
                        id="settings-username"
                        value={username}
                        onChange={(event) => {
                          setUsername(event.target.value);
                          setError('');
                          setSuccess('');
                        }}
                        disabled={saving}
                        placeholder="Your username"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="settings-email"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Email
                      </label>

                      <Input
                        id="settings-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError('');
                          setSuccess('');
                        }}
                        disabled={saving}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={handleSaveProfile}
                      disabled={saving || !hasChanges}
                    >
                      {saving ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Palette className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how DesignLens looks on your device.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Theme
              </label>

              <ThemeSelector />
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Choose the notifications you want to receive.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              {notificationSettings.map((setting) => (
                <ToggleRow
                  key={setting.key}
                  title={setting.title}
                  description={setting.description}
                  defaultOn={setting.defaultOn}
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

const notificationSettings = [
  {
    key: 'analysis-complete',
    title: 'Analysis Complete',
    description:
      'Get notified when an analysis finishes processing.',
    defaultOn: true,
  },
  {
    key: 'weekly-summary',
    title: 'Weekly Summary',
    description:
      'Receive a weekly summary of your design scores.',
    defaultOn: true,
  },
  {
    key: 'product-updates',
    title: 'Product Updates',
    description:
      'Hear about new features and improvements.',
    defaultOn: false,
  },
];

function ToggleRow({
  title,
  description,
  defaultOn,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <Toggle defaultOn={defaultOn} />
    </div>
  );
}

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      type="button"
      onClick={() => setOn((previous) => !previous)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background',
        on ? 'bg-primary' : 'bg-muted'
      )}
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Disable notification' : 'Enable notification'}
    >
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
          on ? 'left-[22px]' : 'left-0.5'
        )}
      />
    </button>
  );
}