'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ShieldCheck, Zap } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signup, isActionLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#09090b] p-4 overflow-hidden select-none">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-[340px] z-10">
        <div className="bg-[#111114] border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden box-border">

          <div className="mb-6 text-center">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/20">
              <UserPlus className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-black text-white uppercase italic tracking-tight leading-none">Register Operator</h2>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-2">Initialize Clearance</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
             <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Identity (Full Name)</label>
              <div className="relative w-full">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-purple-500/40 transition-all font-medium box-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Channel (Email)</label>
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@mission.control"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-purple-500/40 transition-all font-medium box-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Key (Password)</label>
              <div className="relative w-full">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-purple-500/40 transition-all font-medium box-border"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isActionLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[9px] py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 h-12"
            >
              {isActionLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Zap size={12} />}
              {isActionLoading ? 'ESTABLISHING...' : 'DEPLOY PROFILE'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              Existing Operator?{' '}
              <Link href="/signin" className="text-purple-500 ml-1 underline underline-offset-4">
                Establish Link
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center px-4 opacity-30">
           <div className="flex items-center gap-2">
             <ShieldCheck size={10} className="text-white" />
             <span className="text-[7px] font-black text-white uppercase tracking-widest">Secure Link</span>
           </div>
           <span className="text-[7px] font-black text-white uppercase tracking-widest">v3.2.0-A</span>
        </div>
      </div>
    </div>
  );
}
