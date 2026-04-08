'use client';

import { supabase } from '@/utils/supabase';
import { LogIn, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-bold text-white leading-none mb-1">
            {user.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-zinc-500 leading-none">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium transition-all group"
        >
          <LogOut size={16} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span className="group-hover:text-white transition-colors">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth')}
      className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-black transition-all shadow-lg shadow-white/10"
    >
      <LogIn size={18} />
      <span>Sign In</span>
    </button>
  );
}
