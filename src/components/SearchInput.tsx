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

  const isValidDomain = (val: string) => {
    // Simple regex to check for domain structure (something.something)
    const domainRegex = /^(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidDomain(url) && !isLoading) {
      // Ensure there's a basic URL structure before sending
      const cleanUrl = url.trim().toLowerCase();
      onSearch(cleanUrl);
      setUrl('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 md:px-4">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center group"
      >
        {/* Icon removed */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter company URL with vaild domain ( .com  .in  .org etc)"
          disabled={isLoading}
          className="w-full h-14 md:h-16 px-6 md:px-8 pr-16 md:pr-20 bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-xl md:rounded-2xl outline-none text-zinc-100 placeholder:text-zinc-600 transition-all text-base md:text-lg glass-panel backdrop-blur-xl"
        />

        <div className="absolute right-2 md:right-3 flex items-center gap-2">
          {url && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="submit"
              disabled={isLoading || !isValidDomain(url)}
              className={`p-3 rounded-xl md:rounded-2xl transition-all shadow-lg flex items-center justify-center shrink-0 h-10 w-10 md:h-12 md:w-12 ${
                isValidDomain(url) 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 shadow-none'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin md:size-20" />
              ) : (
                <Send size={18} className="md:size-20" />
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
