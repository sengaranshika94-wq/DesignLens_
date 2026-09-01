import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Settings,
  ChevronDown,
  Check,
} from 'lucide-react';

import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

import {
  DashboardSidebarDesktop,
  DashboardSidebarMobile,
  MobileMenuButton,
  navItems,
} from '@/components/layout/DashboardSidebar';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const accountRef = useRef(null);
  const notificationRef = useRef(null);

  const { user,logout } = useAuth();

  const currentNav =
    navItems.find((item) => item.to === location.pathname) ||
    navItems.find((item) => item.to === '/dashboard');

  const username = user?.username || 'User';

  const initials = username
    .trim()
    .slice(0, 2)
    .toUpperCase() || 'U';

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setSidebarOpen(false);
    setAccountOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <DashboardSidebarDesktop />

      {/* Mobile sidebar */}
      <DashboardSidebarMobile
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <MobileMenuButton
              onClick={() => setSidebarOpen(true)}
            />

            <div className="flex items-center lg:hidden">
              <Logo size="sm" to="/dashboard" />
            </div>

            <div className="hidden min-w-0 lg:block">
              <div className="text-xs text-muted-foreground">
                DesignLens
              </div>

              <div className="truncate text-sm font-semibold text-foreground">
                {currentNav?.label || 'Overview'}
              </div>
            </div>

            <h1 className="hidden truncate text-base font-semibold text-foreground sm:block lg:hidden">
              {currentNav?.label || 'Overview'}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (previous) => !previous
                  )
                }
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <Bell className="h-4 w-4" />

                {/* Keep the indicator subtle */}
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Notifications
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Recent DesignLens activity
                        </p>
                      </div>

                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        1
                      </span>
                    </div>

                    <div className="p-2">
                      <div className="flex items-start gap-3 rounded-lg p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                          <Check className="h-4 w-4 text-success" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Your analyses are ready
                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Completed analyses will appear in your history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme */}
            <ThemeToggle />

            {/* Account */}
            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setAccountOpen((previous) => !previous)
                }
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-1 pr-2 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:gap-2.5 sm:pr-3"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-400 text-xs font-semibold text-white">
                  {initials}
                </div>

                {/* Username */}
                <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:block">
                  {username}
                </span>

                <ChevronDown
                  className={`hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform sm:block ${
                    accountOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Account dropdown */}
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                  >
                    {/* User info */}
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {username}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email || 'No email available'}
                      </p>
                    </div>

                    {/* Menu */}
                    <div className="p-1.5">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/settings');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                      await logout();
                      window.location.href = '/login';
                    }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}