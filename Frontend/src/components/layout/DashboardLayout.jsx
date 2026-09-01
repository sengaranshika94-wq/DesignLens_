import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  User,
  Settings,
  ChevronDown,
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

  const location = useLocation();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  const { user } = useAuth();

  const currentNav =
    navItems.find((n) => n.to === location.pathname) || navItems[0];

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const username = user?.username || 'User';

  const initials =
    username.length >= 2
      ? username.slice(0, 2).toUpperCase()
      : username.slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarDesktop />

      <DashboardSidebarMobile
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          
          {/* Left side */}
          <div className="flex items-center gap-3">
            <MobileMenuButton
              onClick={() => setSidebarOpen(true)}
            />

            <div className="flex items-center gap-2 lg:hidden">
              <Logo size="sm" to="/dashboard" />
            </div>

            <h1 className="hidden text-base font-semibold text-foreground sm:block lg:hidden">
              {currentNav.label}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Bell className="h-4 w-4" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </button>

            {/* Theme */}
            <ThemeToggle />

            {/* Account */}
            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-expanded={accountOpen}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pl-1 pr-2 transition-colors hover:bg-secondary sm:pr-3"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-400 text-xs font-semibold text-white">
                  {initials}
                </div>

                {/* Username */}
                <span className="hidden text-sm font-medium text-foreground sm:block">
                  {username}
                </span>

                <ChevronDown
                  className={`hidden h-4 w-4 text-muted-foreground transition-transform sm:block ${
                    accountOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
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
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/settings');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/settings');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                        Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}