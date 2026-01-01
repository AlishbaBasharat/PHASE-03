
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, 
  Target, 
  Layout, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Rocket, 
  Activity,
  MousePointer2
} from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-purple-500/30 overflow-x-hidden scroll-smooth font-sans">
      
      {/* --- GRID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#9333ea 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* --- NAVBAR (Fixed Mobile Dropdown) --- */}
      <nav className="fixed top-0 w-full z-[200] border-b border-white/5 bg-[#09090b]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Custom Hexagon Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-[210]">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-600 rotate-45 rounded-lg animate-pulse opacity-20"></div>
              <div className="relative w-9 h-9 bg-[#111114] border border-purple-500/50 rotate-45 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                <Target size={18} className="text-purple-500 -rotate-45 group-hover:rotate-[-90deg] transition-transform duration-500" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic sm:block hidden">
              Task<span className="text-purple-500">Neon</span>
            </span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#features" className="hover:text-purple-400 transition-colors cursor-pointer">Intelligence</a>
            <a href="#about" className="hover:text-purple-400 transition-colors cursor-pointer">Mission Brief</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-6 relative z-[210]">
            <Link href="/signin" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
              Login
            </Link>
            <Link href="/signup" className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button - High Z-index */}
          <button 
            className="md:hidden p-2 text-white relative z-[220] hover:bg-white/5 rounded-lg transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        <div className={`fixed inset-0 bg-[#09090b] z-[190] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}`}>
           <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase italic tracking-widest text-slate-500 hover:text-purple-500 transition-colors">Features</a>
           <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase italic tracking-widest text-slate-500 hover:text-purple-500 transition-colors">About</a>
           <div className="h-px w-20 bg-white/10 my-4"></div>
           <Link href="/signin" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase italic text-white hover:text-purple-400 transition-colors">Login</Link>
           <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="px-12 py-4 bg-purple-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-2xl active:scale-95">Sign Up</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-30 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8 animate-in fade-in zoom-in duration-700">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 italic">System Online: v2.0.5</span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black mb-8 leading-[0.85] tracking-tighter italic uppercase animate-in slide-in-from-bottom-4 duration-700">
            Execute Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-emerald-400">Missions.</span>
          </h1>

          <p className="text-slate-500 text-sm md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Ditch the clutter. Experience a high-performance workspace designed for speed, clarity, and ultimate task domination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link 
              href="/signup" 
              className="group w-full max-w-[320px] sm:w-auto px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all text-xs flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-95"
            >
              Initialize Control <Rocket size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-500" /> No Card Required
              <span className="opacity-20">|</span>
              <CheckCircle2 size={14} className="text-emerald-500" /> Instant Access
            </div>
          </div>
        </div>
      </main>

      {/* --- NEW CONTENT: LIVE ANALYTICS CARDS --- */}
      {/* --- SYSTEM INFRASTRUCTURE SECTION --- */}
      {/* --- SYSTEM MONITORING INTERFACE --- */}
      <section className="py-32 px-6 relative flex flex-col items-center">
        {/* Central Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/5 blur-[140px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Main System Heading - Center Aligned */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 group cursor-default">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-emerald-400 transition-colors italic">Core System Status</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
              Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-emerald-400">Intelligence</span>
            </h2>
            
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-medium italic leading-relaxed">
              Real-time synchronization metrics across the TaskNeon global infrastructure.
            </p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: 'Global Uptime', 
                val: '99.99%', 
                sub: 'Stable',
                icon: <Activity size={20}/>, 
                theme: 'from-emerald-500 to-teal-400',
                glow: 'shadow-emerald-500/20',
                border: 'hover:border-emerald-500/30'
              },
              { 
                label: 'Edge Latency', 
                val: '24ms', 
                sub: 'Optimized',
                icon: <Zap size={20}/>, 
                theme: 'from-purple-600 to-indigo-400',
                glow: 'shadow-purple-500/20',
                border: 'hover:border-purple-500/30'
              },
              { 
                label: 'Encryption', 
                val: 'AES-256', 
                sub: 'Military Grade',
                icon: <Target size={20}/>, 
                theme: 'from-fuchsia-600 to-pink-500',
                glow: 'shadow-fuchsia-500/20',
                border: 'hover:border-fuchsia-500/30'
              },
              { 
                label: 'Request Speed', 
                val: '0.4s', 
                sub: 'Instant',
                icon: <Rocket size={20}/>, 
                theme: 'from-amber-500 to-orange-400',
                glow: 'shadow-amber-500/20',
                border: 'hover:border-amber-500/30'
              }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`group relative bg-[#0d0d0f] border border-white/[0.05] p-8 rounded-[40px] transition-all duration-500 hover:bg-[#111114] ${stat.border} hover:shadow-2xl ${stat.glow}`}
              >
                <div className="relative z-10">
                  {/* Icon Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400 group-hover:text-white transition-colors duration-500">
                      {stat.icon}
                    </div>
                    <div className="text-[10px] font-black text-slate-700 group-hover:text-slate-500 uppercase tracking-widest italic">Live</div>
                  </div>

                  {/* Data */}
                  <div className="space-y-1 mb-8">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{stat.label}</p>
                    <h4 className="text-3xl font-black italic text-white tracking-tighter">{stat.val}</h4>
                  </div>

                  {/* Visual Analytics Bar */}
                  <div className="relative w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.theme} rounded-full`}></div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">{stat.sub}</span>
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Online</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- FEATURES GRID --- */}
      {/* --- CLEAN PROFESSIONAL FEATURES --- */}
      <section id="features" className="py-32 px-6 relative border-t border-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header - Simple & Centered */}
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4">Core Protocols</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight">
              Designed for <span className="text-slate-500">Efficiency.</span>
            </h3>
          </div>

          {/* Feature List - Clean & Vertical */}
          <div className="space-y-12">
            {[
              { 
                title: "Instant Sync", 
                desc: "Real-time updates across your entire operational dashboard without page refreshes.",
                icon: <Zap size={20} />,
                color: "text-emerald-500"
              },
              { 
                title: "Mission Focus", 
                desc: "Minimalist architecture ensures that your objectives are always front and center.",
                icon: <Target size={20} />,
                color: "text-purple-500"
              },
              { 
                title: "Neon Console", 
                desc: "A high-contrast dark interface built specifically for focused execution.",
                icon: <Layout size={20} />,
                color: "text-fuchsia-500"
              }
            ].map((f, i) => (
              <div 
                key={i} 
                className="group flex flex-col md:flex-row items-center md:items-start gap-6 p-8 rounded-[32px] hover:bg-white/[0.02] transition-colors duration-500 text-center md:text-left"
              >
                {/* Icon Circle */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-[#111114] border border-white/5 flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  {f.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight text-white group-hover:text-purple-400 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-slate-500 text-base leading-relaxed italic font-medium max-w-2xl">
                    {f.desc}
                  </p>
                </div>

                {/* Subtle Status Indicator */}
                <div className="hidden md:block self-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-3 py-1 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-slate-600">
                     Active
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Bottom Divider */}
          <div className="mt-24 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 px-6 bg-[#0c0c0e] relative z-10 overflow-hidden">
        <div className="absolute -right-20 top-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-1 bg-purple-600 mx-auto mb-8 rounded-full shadow-[0_0_15px_#9333ea]"></div>
          <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mb-4">Tactical Briefing</h2>
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter italic leading-none">Engineered for Focus</h2>
          <p className="text-slate-400 text-sm md:text-lg leading-relaxed mb-16 italic font-medium">
            TaskNeon AI isn't just a to-do list; it's a command center. We stripped away the noise of traditional productivity tools to give you a raw, powerful interface that gets out of your way.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 hover:border-emerald-500/20 transition-colors group">
              <h4 className="text-white font-black uppercase text-xs mb-3 tracking-widest group-hover:text-emerald-400 transition-colors">Protocol 01: Speed</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">Built with Next.js 15 for sub-second page transitions and ultra-fast task management updates.</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 hover:border-purple-500/20 transition-colors group">
              <h4 className="text-white font-black uppercase text-xs mb-3 tracking-widest group-hover:text-purple-400 transition-colors">Protocol 02: Clarity</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">Minimalist architecture ensures that your most important objectives are always locked in view.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-[#09090b] text-center px-6 relative z-10">
        <div className="flex justify-center gap-8 mb-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-purple-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-500 transition-colors">Intel</a>
        </div>
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em] italic">
          TaskNeon AI © 2025 • Command Your Day.
        </p>
      </footer>
    </div>
  );
}