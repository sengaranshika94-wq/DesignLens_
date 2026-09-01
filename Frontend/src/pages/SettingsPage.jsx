import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Check } from 'lucide-react';

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

import { getUser } from '@/services/authService';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">
          Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your account, appearance, and notifications.
        </p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4.5 w-4.5" size={18} />
              </div>

              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  View your account information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-400 text-xl font-bold text-white">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>

                {/* User information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Username
                    </label>

                    <Input
                      value={user?.username || ''}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>

                    <Input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" disabled>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="h-4.5 w-4.5" size={18} />
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
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                Theme
              </label>

              <ThemeSelector />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-4.5 w-4.5" size={18} />
              </div>

              <div>
                <CardTitle>Notifications</CardTitle>

                <CardDescription>
                  Choose what you want to be notified about.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {notificationSettings.map((setting) => (
              <ToggleRow
                key={setting.key}
                {...setting}
              />
            ))}
          </CardContent>
        </Card>
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
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="text-xs text-muted-foreground">
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
      onClick={() => setOn(!on)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-primary' : 'bg-muted'
      )}
      role="switch"
      aria-checked={on}
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