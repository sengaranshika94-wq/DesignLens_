import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  History,
  Settings,
  Menu,
  X,
} from 'lucide-react';

import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    to: '/dashboard',
  },
  {
    label: 'Analyze',
    icon: ScanLine,
    to: '/analyze',
  },
  {
    label: 'History',
    icon: History,
    to: '/history',
  },
  {
    label: 'Settings',
    icon: Settings,
    to: '/settings',
  },
];

export default function DashboardSidebar({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <Icon className="h-4.5 w-4.5 shrink-0" size={18} />

                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function DashboardSidebarMobile({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card lg:hidden"
          >
            {/* Drawer header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo size="sm" to="/dashboard" />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <DashboardSidebar onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function DashboardSidebarDesktop() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/50 lg:flex">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Logo size="sm" to="/dashboard" />
      </div>

      <DashboardSidebar />
    </aside>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open sidebar menu"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export { navItems };