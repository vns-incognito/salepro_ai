'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/');
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName 
            }
          }
        });
        if (error) throw error;
        setSuccess(true);
        setLoading(false);
        return; // Don't redirect yet
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gemini-gradient flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">SalePro</h1>
          <p className="text-zinc-500 mt-2">Next-gen AI Sales Intelligence</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex bg-zinc-900/50 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-green-500/10 border border-green-500/50 rounded-2xl text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-white font-bold">Check your email</h3>
                  <p className="text-zinc-400 text-sm">
                    We've sent a confirmation link to <span className="text-white font-medium">{email}</span>. Please verify your email to continue.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-zinc-500 hover:text-white text-xs underline"
                  >
                    Back to login
                  </button>
                </motion.div>
              ) : (
                <>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1 block">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1 block">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1 block">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-medium pl-1">{error}</p>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </>
              )}
            </AnimatePresence>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-500 font-bold tracking-widest">Or</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/?guest=true')}
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all"
          >
            Continue as Guest
          </button>

          <p className="text-center text-zinc-600 text-xs mt-6 px-4">
            By continuing, you agree to SalePro's Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
