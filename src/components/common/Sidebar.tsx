import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Activity, Trophy, Users, Info, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { NAV_ITEMS } from '@/constants';
import { t } from '@/constants/translations';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = { LayoutDashboard, Calendar, Activity, Trophy, Users, Info };

/** Map NAV_ITEMS label to translation key */
function navLabelToKey(label: string): string {
  const map: Record<string, string> = {
    Home: 'nav.home',
    Matches: 'nav.matches',
    LiveScores: 'nav.liveScores',
    Standings: 'nav.standings',
    Groups: 'nav.groups',
    Teams: 'nav.teams',
    Players: 'nav.players',
    Statistics: 'nav.statistics',
    TopScorers: 'nav.topScorers',
    Stadiums: 'nav.stadiums',
    Countries: 'nav.countries',
    Predictions: 'nav.predictions',
    About: 'nav.about',
    Donate: 'nav.donate',
  };
  return map[label] || label;
}

export function Sidebar() {
  const { sidebarCollapsed, theme, toggleTheme, toggleSidebar, toggleLanguage, language } = useAppStore();
  const isDark = theme === 'dark';
  const sidebarBg = isDark ? '#0F172A' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textMuted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const logoColor = isDark ? '#ffffff' : '#1E293B';

  return (
    <motion.aside className="fixed lg:relative z-30 h-full flex flex-col overflow-hidden" initial={false} animate={{ width: sidebarCollapsed ? 80 : 260 }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ backgroundColor: sidebarBg, borderRight: `1px solid ${borderColor}`, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)' }} aria-label={t('common.mainNav', language)}>
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0033A0] to-[#E4002B] flex items-center justify-center shadow-lg shadow-[#0033A0]/20"><Trophy size={20} className="text-white" /></div>
              <div><h1 className="text-base font-black tracking-tight" style={{ color: logoColor }}>WC<span className="text-[#0033A0]">26</span> INSIGHT</h1><p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: textMuted }}>{t('home.dashboardLabel', language)}</p></div>
            </motion.div>
          ) : (
            <motion.div key="collapsed" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0033A0] to-[#E4002B] flex items-center justify-center shadow-lg shadow-[#0033A0]/20"><Trophy size={20} className="text-white" /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const translatedLabel = t(navLabelToKey(item.label) as any, language);
          return (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #0033A0, #001B44)', boxShadow: '0 4px 15px rgba(0, 51, 160, 0.35)', color: '#ffffff', fontWeight: 600 } : { color: textMuted }}
              aria-label={translatedLabel}>
              <Icon size={20} />
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="text-sm font-medium whitespace-nowrap">{translatedLabel}</motion.span>}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 py-4 space-y-2" style={{ borderTop: `1px solid ${borderColor}` }}>
        <button onClick={toggleSidebar} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200" style={{ color: textMuted }} aria-label={sidebarCollapsed ? t('common.expand', language) : t('common.collapse', language)}>
          {sidebarCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><AnimatePresence mode="wait">{!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">{t('common.collapse', language)}</motion.span>}</AnimatePresence></>}
        </button>
        <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200" style={{ color: textMuted }} aria-label={t('common.toggleTheme', language)}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <AnimatePresence mode="wait">{!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">{theme === 'dark' ? t('common.lightMode', language) : t('common.darkMode', language)}</motion.span>}</AnimatePresence>
        </button>

        {/* Language Switch */}
        <button onClick={toggleLanguage} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200" style={{ color: textMuted }} aria-label={t('common.toggleLang', language)}>
          <span className="text-sm font-bold">{language === 'en' ? 'ES' : 'EN'}</span>
          <AnimatePresence mode="wait">{!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">{language === 'en' ? 'Español' : 'English'}</motion.span>}</AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
