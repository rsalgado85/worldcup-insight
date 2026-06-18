/**
 * SplashScreen — World Cup 2026 Loading Screen
 *
 * Premium animated splash screen shown during initial app load.
 * Features rotating WC trivia tips, progress bar, decorative particles,
 * and the official WC2026 logo with trophy motif.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, Globe, Star } from 'lucide-react';

const WC_TIPS_EN = [
  'The 2026 World Cup is the first to feature 48 teams, up from 32.',
  'Matches will be played across 16 stadiums in the United States, Canada, and Mexico.',
  'The tournament runs from June 11 to July 19, 2026 — 39 days of football.',
  'Estadio Azteca in Mexico City will host its third World Cup opening match.',
  'MetLife Stadium in New Jersey will host the 2026 World Cup Final.',
  'This is the first World Cup hosted by three nations simultaneously.',
  'Canada will host World Cup matches for the first time in history.',
  'SoFi Stadium in Los Angeles features a 70,000-seat capacity.',
];

const WC_TIPS_ES = [
  'El Mundial 2026 es el primero con 48 selecciones, aumentando desde 32.',
  'Los partidos se jugarán en 16 estadios de Estados Unidos, Canadá y México.',
  'El torneo se disputa del 11 de junio al 19 de julio de 2026 — 39 días de fútbol.',
  'El Estadio Azteca albergará su tercer partido inaugural de un Mundial.',
  'El MetLife Stadium de Nueva Jersey será la sede de la Final del Mundial 2026.',
  'Es la primera Copa del Mundo organizada por tres países simultáneamente.',
  'Canadá será anfitrión de partidos mundialistas por primera vez en la historia.',
  'El SoFi Stadium de Los Ángeles tiene capacidad para 70,000 espectadores.',
];

const SOCCER_DECORATIONS = [
  { icon: Trophy, color: '#CCBA8C', delay: 0 },
  { icon: Swords, color: '#4583CA', delay: 1.5 },
  { icon: Globe, color: '#1A3D7F', delay: 3 },
  { icon: Star, color: '#CCBA8C', delay: 4.5 },
];

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  language?: 'en' | 'es';
}

export function SplashScreen({ isVisible, onComplete, language = 'es' }: SplashScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const tips = language === 'es' ? WC_TIPS_ES : WC_TIPS_EN;
  const isSpanish = language === 'es';

  // Rotate tips every 3.5s
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isVisible, tips.length]);

  // Simulate progressive loading
  useEffect(() => {
    if (!isVisible) return;
    const duration = 3000; // 3 seconds total
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve
      const p = Math.min(100, 100 * (1 - Math.pow(1 - step / steps, 3)));
      setProgress(p);

      if (step >= steps) {
        clearInterval(timer);
        // Brief delay before exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => onComplete?.(), 600);
        }, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  const floatingIcons = SOCCER_DECORATIONS.map((d, i) => {
    const positions = [
      { top: '15%', left: '10%' },
      { top: '70%', left: '85%' },
      { top: '10%', left: '80%' },
      { top: '75%', left: '15%' },
    ];
    return { ...d, ...positions[i] };
  });

  return (
    <AnimatePresence>
      {isVisible && !isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #1a2744 0%, #0f1729 40%, #080c14 100%)',
          }}
        >
          {/* Decorative soccer field lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white" />
          </div>

          {/* Floating decorative icons */}
          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: item.top, left: item.left }}
              animate={{
                y: [0, -15, 0, 10, 0],
                rotate: [0, 10, -5, 8, 0],
              }}
              transition={{
                duration: 5 + i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: item.delay,
              }}
            >
              <item.icon
                size={i === 0 ? 28 : 20}
                style={{ color: `${item.color}22` }}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${4 + (i % 4) * 3}px`,
                height: `${4 + (i % 4) * 3}px`,
                background: i % 2 === 0 ? '#CCBA8C33' : '#4583CA33',
                left: `${10 + i * 11}%`,
                top: `${15 + (i % 3) * 28}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 12 }}
              className="mb-6"
            >
              <div
                className="w-28 h-28 rounded-3xl flex items-center justify-center p-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,31,68,0.6), rgba(15,45,106,0.3))',
                  border: '2px solid rgba(226,184,76,0.35)',
                  boxShadow: '0 0 80px rgba(226,184,76,0.2), 0 0 160px rgba(10,31,68,0.3)',
                }}
              >
                <img
                  src="/logo.svg"
                  alt="FIFA World Cup 2026"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(226,184,76,0.3)]"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-2"
            >
              <h1 className="text-3xl font-black tracking-tight text-white">
                WC26{' '}
                <span style={{ color: '#CCBA8C' }}>INSIGHT</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-white/40 mb-8"
            >
              {isSpanish ? 'Cargando datos del mundial...' : 'Loading World Cup data...'}
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full space-y-3"
            >
              <div className="w-full h-2 rounded-full overflow-hidden bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, #1A3D7F, #4583CA, #CCBA8C)',
                    boxShadow: '0 0 12px rgba(204,186,140,0.3)',
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/30">
                  {isSpanish ? 'Conectando...' : 'Connecting...'}
                </span>
                <span className="text-xs font-bold font-mono" style={{ color: '#CCBA8C' }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>

            {/* Tip Carousel */}
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-[11px] italic max-w-xs mx-auto leading-relaxed text-white/25">
                💡 {tips[tipIndex]}
              </p>
            </motion.div>
          </div>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/[0.12]">
              FIFA World Cup 2026™
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
