'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Sidebar from '@/components/Sidebar';
import AuthButton from '@/components/AuthButton';
import SearchInput from '@/components/SearchInput';
import EmailGrid from '@/components/EmailGrid';
import OnboardingModal from '@/components/OnboardingModal';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboarding(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkOnboarding(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboarding = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('organization, role')
        .eq('id', userId)
        .maybeSingle(); // Better than .single() as it doesn't error on 0 rows

      if (error) {
        console.warn('Profile fetch error:', error);
        return;
      }

      if (!data || !data.organization || !data.role) {
        console.log('Onboarding triggered: Profile incomplete.');
        setShowOnboarding(true);
      } else {
        console.log('Profile validated. Skipping onboarding.');
      }
    } catch (err) {
      console.error('Check onboarding failed:', err);
    }
  };

  useEffect(() => {
    // Supabase Realtime Listener on the 'hunts' table
    console.log('Initializing Realtime connection...');
    const channel = supabase
      .channel('hunts-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hunts' },
        async (payload) => {
          console.log('📡 Realtime: Event received!', payload.new);
          
          const { data: { session } } = await supabase.auth.getSession();
          
          // Verify this hunt belongs to the current user
          if (payload.new.user_id === session?.user?.id) {
            console.log('✅ Realtime: Matching data received for user!', payload.new);
            setCurrentData(payload.new);
            setIsLoading(false);
          } else {
            console.log('⏳ Realtime: Data received but user_id mismatch.', { 
                payloadId: payload.new.user_id, 
                currentId: session?.user?.id 
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to hunts table changes');
        }
      });

    return () => {
      console.log('Cleaning up Realtime connection...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle Loading Timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      timeout = setTimeout(() => {
        console.warn('Loading timed out after 90 seconds.');
        setIsLoading(false);
        if (!currentData) {
          alert('Mission took too long. Please check your Supabase "hunts" table to see if data arrived, and ensure Realtime is enabled in the Supabase Dashboard.');
        }
      }, 90000); // 90 second timeout
    }
    return () => clearTimeout(timeout);
  }, [isLoading, currentData]);

  const handleSelectHistory = (item: any) => {
    setCurrentData(item);
    setIsLoading(false);
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (inputUrl: string) => {
    setIsLoading(true);
    setCurrentData(null);

    // Ensure URL has a protocol
    let url = inputUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // 1. Check if URL already exists for THIS user (Cache check)
    if (session?.user?.id) {
      try {
        const { data: existingHunt, error: searchError } = await supabase
          .from('hunts')
          .select('*')
          .eq('url', url)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!searchError && existingHunt) {
          console.log('✅ Found existing hunt in database, skipping webhook.');
          setCurrentData(existingHunt);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.log('Cache check failed or no record found, proceeding to webhook...');
      }
    }

    // 2. Proceeed to Webhook if not found or if is guest
    const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || 'YOUR_WEBHOOK_URL';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url,
          userId: session?.user?.id || null,
          userName: session?.user?.user_metadata?.full_name || 'Guest',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook responded with ${response.status}: ${errorText || 'Check Make.com logs for [400] details.'}`);
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      setIsLoading(false);
      alert('Mission failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex">
      <Sidebar onSelectItem={handleSelectHistory} />
      
      <AnimatePresence>
        {showOnboarding && session?.user && (
          <OnboardingModal 
            userId={session.user.id} 
            onComplete={() => setShowOnboarding(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col pl-20 lg:pl-0 ml-0 lg:ml-20 transition-all duration-300">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl gemini-gradient flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
             </div>
             <h1 className="text-xl font-bold tracking-tight">SalePro</h1>
          </div>
          <AuthButton />
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {!isLoading && !currentData ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4 mb-20"
              >
                <h2 className="text-4xl md:text-6xl font-bold">How can I help you <span className="text-blue-500">sell</span> today?</h2>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                  Paste a company website URL below and I'll generate a personalized, high-conversion outreach sequence in seconds.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex-1 flex flex-col items-center justify-center pt-10"
              >
                <EmailGrid data={currentData} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Input Area */}
        <div className="sticky bottom-10 w-full z-40 pb-6">
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
