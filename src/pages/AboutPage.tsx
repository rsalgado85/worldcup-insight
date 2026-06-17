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
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

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

const features = [
  { icon: Trophy, title: '48 Teams', desc: 'Complete roster of all qualified nations for FIFA World Cup 2026™ with rankings and confederation data.' },
  { icon: Globe, title: '16 Stadiums', desc: 'All host venues across the United States, Mexico, and Canada with capacity and location information.' },
  { icon: Server, title: 'Real-time Data', desc: 'Powered by the worldcup26.ir API, delivering match results, group standings, and tournament statistics.' },
  { icon: Layers, title: 'Interactive Analytics', desc: 'Rich data visualizations with Recharts — goals by group, possession stats, card distributions, and matchday trends.' },
  { icon: Award, title: 'Top Scorers', desc: 'Golden Boot rankings — goals, assists, and player ratings.' },
  { icon: Cpu, title: 'Predictions Engine', desc: 'Knockout bracket simulator with group stage projections and random tournament outcomes.' },
];

export function AboutPage() {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

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
                <Trophy size={56} className="text-[#F2A900]" />
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
              World Cup <span className="text-[#F2A900]">Insight</span> v2
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 mt-3 max-w-lg leading-relaxed text-sm"
            >
              A comprehensive FIFA World Cup 2026™ analytics platform. Explore all 48 qualified teams,
              track match results in real time, analyze player statistics, visualize tournament data
              with interactive charts, and simulate knockout bracket predictions.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-xs mt-3"
            >
              Built with React 19, TypeScript, Recharts, and Framer Motion — powered by the worldcup26.ir API.
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
        <h2 className="text-xl font-bold text-text-primary mb-2">Tech Stack</h2>
        <p className="text-text-secondary text-sm mb-6">Modern web technologies powering the World Cup Insight platform</p>
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
        <h2 className="text-xl font-bold text-text-primary mb-2">API & Data Sources</h2>
        <p className="text-text-secondary text-sm mb-6">External APIs and data providers that make this platform possible</p>
        <div className="glass-card-hover p-4 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0033A0]/10 flex items-center justify-center flex-shrink-0">
            <Globe size={18} className="text-[#0033A0]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">worldcup26.ir</h3>
            <p className="text-xs text-text-secondary mt-0.5">Primary data source for teams, matches, groups, stadiums, and players.</p>
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
        <h2 className="text-xl font-bold text-text-primary mb-2">About This Platform</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          World Cup Insight v2 is a fan-built analytics platform created to provide comprehensive
          coverage of the FIFA World Cup 2026™. The platform aggregates data from the worldcup26.ir
          API to deliver real-time match updates, team information, player statistics, and interactive
          data visualizations.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          The prediction engine uses random simulation for bracket projections and is intended for
          entertainment purposes only. All official data belongs to FIFA and respective data providers.
          This project is not affiliated with or endorsed by FIFA.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-xs text-text-secondary/40">
          &copy; {new Date().getFullYear()} World Cup Insight v2 — Fan-made FIFA World Cup 2026™ analytics platform.
        </p>
        <p className="text-[10px] text-text-secondary/30 mt-1">
          FIFA World Cup is a trademark of FIFA. This site is not affiliated with FIFA.
        </p>
      </motion.div>
    </div>
  );
}
