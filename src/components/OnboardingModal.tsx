'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Building2, Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  onComplete: () => void;
  userId: string;
}

export default function OnboardingModal({ onComplete, userId }: OnboardingModalProps) {
  const [loading, setLoading] = useState(false);
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');

  useState(() => {
    // Initial fetch of user metadata if available
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    });
  });

  const roles = [
    'Freelancer',
    'Agency Owner',
    'Sales Representative',
    'Marketing Manager',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !role) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: fullName,
          organization,
          role,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('Onboarding failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-panel rounded-[2rem] border border-zinc-800 p-8 md:p-12 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-400">
            <Rocket size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-3">Welcome to the Hunt</h2>
          <p className="text-zinc-400">Let's personalize your AI sales engine.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">What's your organization?</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">What's your primary role?</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                    role === r 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={loading || !organization || !role}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all hover:bg-zinc-200 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>Complete Onboarding</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
