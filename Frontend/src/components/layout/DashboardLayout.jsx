import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  DashboardSidebarDesktop,
  DashboardSidebarMobile,
  MobileMenuButton,
  navItems,
} from '@/components/layout/DashboardSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentNav =
    navItems.find((n) => n.to === location.pathname) || navItems[0];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarDesktop />

      <DashboardSidebarMobile open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
            <div className="flex items-center gap-2 lg:hidden">
              <Logo size="sm" to="/dashboard" />
            </div>
            <h1 className="hidden text-base font-semibold text-foreground sm:block lg:hidden">
              {currentNav.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <ThemeToggle />
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-400 text-xs font-semibold text-white">
                JD
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:block">
                Jordan D.
              </span>
            </div>
          </div>
        </header>

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
