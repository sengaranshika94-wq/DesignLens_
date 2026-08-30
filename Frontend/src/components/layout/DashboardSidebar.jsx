import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  History,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Analyze', icon: ScanLine, to: '/analyze' },
  { label: 'History', icon: History, to: '/history' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

export default function DashboardSidebar({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
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
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-4.5 w-4.5" size={18} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function DashboardSidebarMobile({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo size="sm" />
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DashboardSidebar onNavigate={onClose} />
            <div className="border-t border-border p-3">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                <LogOut className="h-4.5 w-4.5" size={18} />
                Log out
              </button>
            </div>
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
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
          <LogOut className="h-4.5 w-4.5" size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export { navItems };
export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
