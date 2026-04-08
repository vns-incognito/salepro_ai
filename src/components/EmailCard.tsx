'use client';

import { Copy, Check, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailCardProps {
  title: string;
  content: string;
  delay?: number;
}

export default function EmailCard({ title, content, delay = 0 }: EmailCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-zinc-800 hover:border-blue-500/50 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Mail size={18} />
          </div>
          <h3 className="font-bold text-zinc-100 tracking-tight">{title}</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors relative"
          title="Copy to clipboard"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="bg-zinc-950/40 rounded-xl p-5 border border-zinc-900/50 flex-1 relative z-10 backdrop-blur-sm">
        <pre className="text-zinc-300 text-[13px] md:text-sm whitespace-pre-wrap font-sans leading-relaxed selection:bg-blue-500/30">
          {content || "Generating sequence... please wait while Gemini processes the site data."}
        </pre>
      </div>
    </motion.div>
  );
}
