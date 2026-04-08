'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Target, Crown, Sparkles } from 'lucide-react';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with AI sales.',
    features: [
      '3 Hunts per day',
      'Standard AI Analysis',
      'Cold Email Generation',
      'Basic Company Insights',
      'Last 20 history items'
    ],
    current: true,
    ringColor: 'ring-emerald-500/50',
    icon: <Zap size={24} className="text-emerald-400" />,
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'Power up your outreach with more volume.',
    features: [
      '50 Hunts per day',
      'Advanced Gemini Pro Analysis',
      'Follow-up & Closing Sequences',
      'Deep Audience Pain Points',
      'Unlimited History',
      'Priority Response Time'
    ],
    current: false,
    ringColor: 'ring-blue-500/0',
    icon: <Target size={24} className="text-blue-400" />,
  },
  {
    name: 'Maxx',
    price: '$30',
    description: 'The ultimate sales sniper toolkit.',
    features: [
      'Unlimited Hunts',
      'Premium Context Injection',
      'Custom Voice Matching',
      'Export to CRM (CSV/JSON)',
      'Dedicated Account Manager',
      'Sneak peek at new features'
    ],
    current: false,
    ringColor: 'ring-purple-500/0',
    icon: <Crown size={24} className="text-purple-400" />,
  }
];

export default function PlansModal({ isOpen, onClose }: PlansModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white">Choose your <span className="text-blue-500">plan</span></h2>
                <p className="text-zinc-500 mt-1">Scale your outreach from beginner to pro sniper.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Plans Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`relative group p-8 rounded-[2rem] bg-zinc-900/50 border transition-all duration-300 flex flex-col ${
                    plan.current 
                    ? `border-emerald-500/50 ring-4 ${plan.ringColor} bg-emerald-500/[0.02]` 
                    : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.current && (
                    <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Current Plan
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">/month</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                        <Check size={16} className={`shrink-0 mt-0.5 ${plan.current ? 'text-emerald-400' : 'text-blue-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    disabled={plan.current}
                    className={`w-full py-4 rounded-2xl font-bold transition-all ${
                      plan.current 
                      ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                      : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {plan.current ? 'Already Active' : 'Upgrade to ' + plan.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="p-8 pt-0 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                <Sparkles size={16} className="text-blue-500" />
                <p className="text-[11px] text-zinc-500 font-medium">
                  Note: These are dummy plans. SalePro is currently a prototype and may be developed and launched fully later.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
