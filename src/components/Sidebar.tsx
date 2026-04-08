'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { History, ChevronLeft, ChevronRight, Globe, Trash2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onSelectItem?: (item: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ onSelectItem, isOpen, setIsOpen }: SidebarProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('hunts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error && data) {
        setHistory(data);
      }
    };

    fetchHistory();

    const channel = supabase
      .channel('hunts-history')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'hunts'
      }, async (payload) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (payload.new.user_id === session?.user?.id) {
          setHistory((prev) => [payload.new, ...prev].slice(0, 20));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 280 : 0,
          x: isOpen ? 0 : -280
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-screen glass-panel z-[70] flex flex-col border-r border-border transition-all duration-300 overflow-hidden lg:relative lg:translate-x-0 ${isOpen ? 'w-[280px]' : 'w-0 lg:w-20'}`}
        style={{ x: 0 }} // Reset x for Desktop if needed, but the animate handles it
      >
        <div className="p-4 flex items-center justify-between border-b border-border h-20 shrink-0">
          <motion.h2 
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="text-lg font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap"
          >
            Mission History
          </motion.h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 mt-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-zinc-500 text-sm text-center mt-10">
              No missions yet
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  onSelectItem?.(item);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-zinc-800/50 rounded-xl cursor-pointer group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 group-hover:border-blue-500/50 transition-all">
                  <Globe size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-bold truncate text-zinc-100 group-hover:text-blue-400 transition-colors">{item.url}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border bg-zinc-950/20">
          <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
             <div className="w-10 h-10 rounded-xl gemini-gradient flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                <Target size={20} />
             </div>
             <div className="text-xs">
                <p className="font-black text-white">Elite Plan</p>
                <p className="text-zinc-500 font-medium">Unlimited Hunts</p>
             </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
