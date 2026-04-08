'use client';

import { Building2, Target, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightsProps {
  data: {
    company_name?: string;
    companyName?: string;
    about_us?: string;
    aboutUs?: string;
    about?: string;
    target_audience?: string;
    targetAudience?: string;
    audience?: string;
    pain_points?: string;
    painPoints?: string;
    painpoints?: string;
    points?: string;
  };
}

export default function CompanyInsights({ data }: InsightsProps) {
  const company = data.company_name || data.companyName || "Company Research Analysis";
  const about = data.about_us || data.aboutUs || data.about || "Analyzing company background...";
  const audience = data.target_audience || data.targetAudience || data.audience || "Identifying key demographic segments...";
  const painPoints = data.pain_points || data.painPoints || data.painpoints || data.points || "Extracting business challenges and friction points...";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-7xl px-4 mb-8"
    >
      <div className="glass-panel rounded-3xl p-8 border border-zinc-800/50 bg-gradient-to-br from-zinc-900/20 to-transparent">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl gemini-gradient flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{company}</h2>
            <p className="text-blue-400 text-sm font-medium">Deep Research Analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">About the Company</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {about}
            </p>
          </div>

          {/* Target Audience */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Target size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Target Audience</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {audience}
            </p>
          </div>

          {/* Pain Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Core Pain Points</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {painPoints}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
