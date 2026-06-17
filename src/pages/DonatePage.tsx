import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Star, Gift, Zap, ExternalLink } from 'lucide-react';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';

export function DonatePage() {
  const [selected, setSelected] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState('');
  const { language } = useAppStore();

  const AMOUNTS = [
    { value: 5, icon: Coffee, label: t('donate.coffee', language), color: '#8B5CF6' },
    { value: 10, icon: Star, label: t('donate.supporter', language), color: '#F2A900' },
    { value: 25, icon: Gift, label: t('donate.contributor', language), color: '#E4002B' },
    { value: 50, icon: Zap, label: t('donate.champion', language), color: '#0033A0' },
  ];

  const amount = customAmount ? parseFloat(customAmount) || selected : selected;

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0033A0, #E4002B)' }}
        >
          <Heart size={36} className="text-white" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('donate.title', language)}</h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          {t('donate.description', language)}
        </p>
      </motion.div>

      {/* Amount Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="text-sm font-bold text-text mb-4 text-center">{t('donate.chooseAmountUSD', language)}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {AMOUNTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSelected(opt.value); setCustomAmount(''); }}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selected === opt.value && !customAmount
                  ? 'border-wc-blue bg-wc-blue/5 shadow-lg shadow-wc-blue/10'
                  : 'border-border bg-card hover:border-wc-blue/30'
              }`}
            >
              <opt.icon size={24} className="mx-auto mb-2" style={{ color: selected === opt.value && !customAmount ? opt.color : 'var(--color-text-secondary)' }} />
              <div className="text-xl font-black text-text">${opt.value}</div>
              <div className="text-[10px] text-text-secondary">{opt.label}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
          <span className="text-lg font-bold text-text-secondary">$</span>
          <input
            type="number" min="1" step="1"
            placeholder={t('donate.customAmount', language)}
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelected(0); }}
            className="flex-1 bg-transparent text-lg font-bold text-text outline-none placeholder:text-text-secondary/30"
          />
          <span className="text-xs text-text-secondary">USD</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
        <a
          href={`https://www.paypal.com/donate?business=worldcupinsight@example.com&amount=${amount}&currency_code=USD`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0033A0, #1E5FD9)', boxShadow: '0 4px 20px rgba(0, 51, 160, 0.35)' }}
        >
          <Heart size={20} className="animate-pulse" />
          {tf('donate.donateButton', language, amount.toFixed(amount % 1 === 0 ? 0 : 2))}
          <ExternalLink size={14} />
        </a>
        <p className="text-xs text-text-secondary mt-3">{t('donate.secureNote', language)}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 text-center">
        <h3 className="text-sm font-bold text-text mb-2">{t('donate.whatSupportEnables', language)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { icon: Zap, title: t('donate.supportRealTime', language), desc: t('donate.supportRealTimeDesc', language) },
            { icon: Star, title: t('donate.supportFeatures', language), desc: t('donate.supportFeaturesDesc', language) },
            { icon: Coffee, title: t('donate.supportDev', language), desc: t('donate.supportDevDesc', language) },
          ].map((item) => (
            <div key={item.title} className="p-3 rounded-xl bg-wc-blue/[0.03]">
              <item.icon size={20} className="mx-auto mb-2 text-wc-blue" />
              <h4 className="text-xs font-bold text-text">{item.title}</h4>
              <p className="text-[10px] text-text-secondary mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-center text-[10px] text-text-secondary/40">
        {t('donate.disclaimer', language)}
      </p>
    </div>
  );
}
