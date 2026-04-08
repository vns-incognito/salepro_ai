'use client';

import { useState } from 'react';
import { Send, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchInputProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      // Ensure there's a basic URL structure before sending
      const cleanUrl = url.trim().toLowerCase();
      onSearch(cleanUrl);
      setUrl('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center group"
      >
        <div className="absolute left-6 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
          <Globe size={20} />
        </div>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter company URL (e.g. apple.com)..."
          disabled={isLoading}
          className="w-full h-16 pl-14 pr-20 bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none text-zinc-100 placeholder:text-zinc-600 transition-all text-lg glass-panel backdrop-blur-xl"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {url && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              type="submit"
              disabled={isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </motion.button>
          )}
        </div>
      </form>
      <p className="text-center text-zinc-500 text-xs mt-4">
        SalePro scans websites and generates high-conversion sales sequences using Gemini Pro.
      </p>
    </div>
  );
}
