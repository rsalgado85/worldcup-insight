import { motion, AnimatePresence } from 'framer-motion';
import { X, Goal, Zap, Star, Shield } from 'lucide-react';
import { usePlayerModalStore } from '@/store/playerModalStore';
import { FlagImage } from '@/components/common/FlagImage';

export function PlayerModal() {
  const { isOpen, player, close } = usePlayerModalStore();

  return (
    <AnimatePresence>
      {isOpen && player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>

            {/* Avatar background */}
            {player.avatar && (
              <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
                <img
                  src={player.avatar}
                  alt=""
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-[130%] w-auto max-w-none object-cover opacity-30"
                  style={{
                    maskImage: 'linear-gradient(to left, black 20%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 100%)',
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Flag + Team */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center overflow-hidden flex-shrink-0">
                  <FlagImage flag={player.flag} size="md" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-white truncate">{player.name}</h2>
                  <p className="text-sm text-white/60">{player.team}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {player.goals !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Goal size={14} className="text-live" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Goals</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.goals}</p>
                  </div>
                )}
                {player.assists !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap size={14} className="text-warm" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Assists</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.assists}</p>
                  </div>
                )}
                {player.rating !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star size={14} className="text-warm" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Rating</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.rating}</p>
                  </div>
                )}
                {player.cleanSheets !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Shield size={14} className="text-success" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Clean Sheets</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.cleanSheets}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
