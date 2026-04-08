'use client';

import EmailCard from './EmailCard';
import CompanyInsights from './CompanyInsights';
import { motion } from 'framer-motion';

interface EmailGridProps {
  data: {
    cold_email?: string;
    coldEmail?: string;
    follow_up?: string;
    followUp?: string;
    closing?: string;
    closingEmail?: string;
    company_name?: string;
    companyName?: string;
    about_us?: string;
    aboutUs?: string;
    target_audience?: string;
    targetAudience?: string;
    pain_points?: string;
    painPoints?: string;
  } | null;
  isLoading: boolean;
}

export default function EmailGrid({ data, isLoading }: EmailGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full max-w-7xl px-4 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel h-96 rounded-2xl p-6 flex flex-col gap-4 border border-zinc-900 animate-pulse-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
                <div className="h-4 w-32 bg-zinc-800 rounded-full" />
              </div>
              <div className="flex-1 bg-zinc-900/50 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-blue-400 font-medium animate-bounce">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span>Generating leads... this may take a few seconds</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <CompanyInsights data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4 pb-32 mt-8 border-t border-zinc-900 pt-12">
        <EmailCard 
          title="Cold Outreach" 
          content={data.cold_email || data.coldEmail || ""} 
          delay={0.1}
        />
        <EmailCard 
          title="Follow-Up" 
          content={data.follow_up || data.followUp || ""} 
          delay={0.2}
        />
        <EmailCard 
          title="Final Closing" 
          content={data.closing || data.closingEmail || ""} 
          delay={0.3}
        />
      </div>
    </div>
  );
}
