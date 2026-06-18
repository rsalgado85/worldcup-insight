/**
 * About Page — World Cup Insight v2
 */

import { motion } from 'framer-motion';
import {
  Globe,
  Server,
  Database,
  Zap,
  Trophy,
  Code2,
  Palette,
  Layers,
  Cpu,
  Shield,
  Sparkles,
  Award,
  User,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t, tf } from '@/constants/translations';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const techStack = [
  { name: 'React 19', icon: Code2, color: '#61DAFB' },
  { name: 'TypeScript', icon: Shield, color: '#3178C6' },
  { name: 'Vite', icon: Zap, color: '#BD34FE' },
  { name: 'React Router', icon: Globe, color: '#CA4245' },
  { name: 'Framer Motion', icon: Palette, color: '#FF4154' },
  { name: 'Recharts', icon: Layers, color: '#22B5BF' },
  { name: 'Zustand', icon: Database, color: '#443E38' },
  { name: 'React Query', icon: Server, color: '#FF4154' },
  { name: 'Tailwind CSS', icon: Palette, color: '#38BDF8' },
  { name: 'Axios', icon: Globe, color: '#5A29E4' },
  { name: 'Lucide Icons', icon: Sparkles, color: '#F2A900' },
];

export function AboutPage() {
  const { theme, language } = useAppStore();
  const isDark = theme === 'dark';

  const features = [
    { icon: Trophy, title: t('about.feature48', language), desc: t('about.feature48Desc', language) },
    { icon: Globe, title: t('about.feature16', language), desc: t('about.feature16Desc', language) },
    { icon: Server, title: t('about.featureRealtime', language), desc: t('about.featureRealtimeDesc', language) },
    { icon: Layers, title: t('about.featureAnalytics', language), desc: t('about.featureAnalyticsDesc', language) },
    { icon: Award, title: t('about.featureScorers', language), desc: t('about.featureScorersDesc', language) },
    { icon: Cpu, title: t('about.featurePredictions', language), desc: t('about.featurePredictionsDesc', language) },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 relative overflow-hidden rounded-2xl"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'linear-gradient(135deg, #0033A0 0%, #E4002B 50%, #F2A900 100%)' }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-[#0033A0] to-[#E4002B] p-[3px] shadow-xl shadow-[#0033A0]/20">
              <div
                className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: isDark ? '#0F1416' : '#ffffff' }}
              >
                <span className="text-5xl font-black text-[#F2A900]">RS</span>
              </div>
            </div>
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black tracking-tight text-white"
            >
              Robinson <span className="text-[#F2A900]">Salgado</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-sm font-semibold mt-1"
            >
              {t('about.role', language)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 mt-3 max-w-lg leading-relaxed text-sm"
            >
              {t('about.bio', language)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-xs mt-3"
            >
              World Cup Insight v2 · {t('about.techLine', language)}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp} className="glass-card p-5 rounded-2xl hover:border-[#0033A0]/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#0033A0]/10 flex items-center justify-center mb-3">
              <feature.icon size={20} className="text-[#0033A0]" />
            </div>
            <h3 className="font-bold text-sm text-text-primary">{feature.title}</h3>
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 md:p-8 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-text-primary mb-2">{t('about.techStack', language)}</h2>
        <p className="text-text-secondary text-sm mb-6">{t('about.techStackDesc', language)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {techStack.map((tech) => (
            <motion.div key={tech.name} whileHover={{ scale: 1.05, y: -4 }} className="glass-card-hover p-3 rounded-xl flex flex-col items-center gap-2 cursor-default">
              <tech.icon size={24} style={{ color: tech.color }} />
              <span className="text-[10px] font-medium text-center text-text-secondary">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 md:p-8 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-text-primary mb-2">{t('about.apiTitle', language)}</h2>
        <p className="text-text-secondary text-sm mb-6">{t('about.apiDesc', language)}</p>
        <div className="glass-card-hover p-4 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0033A0]/10 flex items-center justify-center flex-shrink-0">
            <Globe size={18} className="text-[#0033A0]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">worldcup26.ir</h3>
            <p className="text-xs text-text-secondary mt-0.5">{t('about.apiSourceDesc', language)}</p>
            <code className="text-[10px] text-[#0033A0] bg-[#0033A0]/5 px-2 py-0.5 rounded mt-1.5 inline-block">
              https://worldcup26.ir/api
            </code>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 md:p-8 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-text-primary mb-2">{t('about.aboutPlatform', language)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('about.platformDesc1', language)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {t('about.platformDesc2', language)}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-xs text-text-secondary/40">
          {tf('about.copyright', language, new Date().getFullYear())}
        </p>
        <p className="text-[10px] text-text-secondary/30 mt-1">
          {t('about.disclaimer', language)}
        </p>
      </motion.div>
    </div>
  );
}
