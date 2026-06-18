import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/common/Sidebar';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LayoutDashboard, Users, BarChart3, Trophy, User } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/matches', icon: Trophy, label: 'Matches' },
  { path: '/standings', icon: BarChart3, label: 'Standings' },
  { path: '/teams', icon: Users, label: 'Teams' },
  { path: '/about', icon: User, label: 'About' },
];

export function MainLayout() {
  const { sidebarCollapsed, theme } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed left-0 top-0 z-50 h-full w-[280px] lg:hidden">
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-3 py-3 border-b border-divider bg-bg/90 backdrop-blur-xl">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg text-text-muted active:scale-95" aria-label="Open navigation menu">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/logos/wc2026-official.svg" alt="World Cup 2026" className="h-7 w-auto object-contain" />
            <span className="text-base font-black tracking-tight text-text">
              WC<span className="text-primary-light">INSIGHT</span>
            </span>
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileBottomNav />

        {/* Desktop Footer */}
        <footer className="hidden lg:block py-3 px-4 md:px-6 lg:px-8 text-center border-t border-divider">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} World Cup Insight v2 — World Cup 2026 analytics platform.
          </p>
        </footer>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="lg:hidden flex items-center justify-around px-2 py-1 border-t border-divider bg-bg/95 backdrop-blur-xl" aria-label="Mobile navigation">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 min-w-0 transition-all active:scale-90 ${isActive ? 'text-primary-light' : 'text-text-muted'}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} />
            <span className="text-[9px] font-semibold truncate max-w-full">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
