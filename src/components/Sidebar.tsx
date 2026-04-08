'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { History, ChevronLeft, ChevronRight, Globe, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onSelectItem?: (item: any) => void;
}

export default function Sidebar({ onSelectItem }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
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
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="h-screen glass-panel fixed left-0 top-0 z-50 flex flex-col border-r border-border transition-all duration-300"
    >
      <div className="p-4 flex items-center justify-between border-b border-border h-16">
        {isOpen && (
          <motion.h2 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          >
            Mission History
          </motion.h2>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-zinc-500 text-sm text-center mt-10">
            {isOpen ? "No missions yet" : <History size={20} className="mx-auto" />}
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectItem?.(item)}
              className="flex items-center gap-3 p-3 hover:bg-zinc-800/50 rounded-xl cursor-pointer group transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                <Globe size={16} className="text-blue-400" />
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.url}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border">
        {isOpen ? (
          <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded-xl">
             <div className="w-8 h-8 rounded-full bg-blue-500" />
             <div className="text-xs">
                <p className="font-medium">Free Plan</p>
                <p className="text-zinc-500">Upgrade for more</p>
             </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto" />
        )}
      </div>
    </motion.aside>
  );
}
