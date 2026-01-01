





// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { 
//   LayoutDashboard, 
//   CheckSquare, 
//   Archive, 
//   Settings, 
//   LogOut,
//   CalendarDays
// } from 'lucide-react';

// export default function Sidebar({ user }: any) {
//   const pathname = usePathname();

//   const isActive = (path: string) => pathname === path;

//   const menuItems = [
//     { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
//     { icon: <CheckSquare size={20} />, label: 'My Tasks', href: '/dashboard/tasks' },
//     { icon: <CalendarDays size={20} />, label: 'Schedule', href: '/dashboard/schedule' }, // Naya option
//     { icon: <Archive size={20} />, label: 'Archive', href: '/dashboard/archive' }, // AI Chat ki jagah
//     { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
//   ];

//   return (
//     <aside className="w-64 border-r border-white/5 bg-[#0B0E14] p-6 flex flex-col h-screen sticky top-0">
//       {/* Logo Section */}
//       <div className="flex items-center gap-3 mb-12">
//         <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
//           <LayoutDashboard className="text-white" size={22} />
//         </div>
//         <span className="text-xl font-bold tracking-tight text-white uppercase italic">TaskNeon</span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-2">
//         {menuItems.map((item, i) => (
//           <Link 
//             key={i} 
//             href={item.href}
//             className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
//               isActive(item.href) 
//                 ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20 shadow-lg shadow-purple-900/5' 
//                 : 'text-gray-500 hover:text-white hover:bg-white/5'
//             }`}
//           >
//             {item.icon}
//             <span className="font-semibold">{item.label}</span>
//           </Link>
//         ))}
//       </nav>

//       {/* User Section */}
//       <div className="mt-auto pt-6 border-t border-white/5">
//         <div className="px-4 mb-4">
//           <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black">Operational Account</p>
//           <p className="text-sm text-gray-300 mt-1 truncate font-medium">{user?.email || 'operator@mission.control'}</p>
//         </div>
        
//       </div>
//     </aside>
//   );
// }










// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth'; // Logout ke liye
// import { 
//   LayoutDashboard, 
//   CheckSquare, 
//   Archive, 
//   Settings, 
//   LogOut,
//   CalendarDays
// } from 'lucide-react';

// export default function Sidebar({ user }: any) {
//   const pathname = usePathname();
//   const { logout } = useAuth(); // Logout hook

//   const isActive = (path: string) => pathname === path;

//   const menuItems = [
//     { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
//     { icon: <CheckSquare size={20} />, label: 'My Tasks', href: '/dashboard/tasks' },
//     { icon: <CalendarDays size={20} />, label: 'Schedule', href: '/dashboard/schedule' },
//     { icon: <Archive size={20} />, label: 'Archive', href: '/dashboard/archive' },
//     { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
//   ];

//   return (
//     <aside className="w-64 border-r border-white/5 bg-[#09090b] p-6 flex flex-col h-screen sticky top-0 z-50">
      
//       {/* LOGO SECTION - Enhanced Neon Look */}
//       <div className="flex items-center gap-3 mb-12 px-2">
//         <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10">
//           <LayoutDashboard className="text-white" size={22} />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-xl font-black tracking-tight text-white uppercase italic leading-none">TaskNeon</span>
//           <span className="text-[7px] font-black text-purple-500 uppercase tracking-[0.4em] mt-1">Operational OS</span>
//         </div>
//       </div>

//       {/* NAVIGATION - Cleaner Active States */}
//       <nav className="flex-1 space-y-1">
//         {menuItems.map((item, i) => {
//           const active = isActive(item.href);
//           return (
//             <Link 
//               key={i} 
//               href={item.href}
//               className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
//                 active 
//                   ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.05)]' 
//                   : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
//               }`}
//             >
//               <span className={`${active ? 'text-purple-500' : 'group-hover:text-purple-400'} transition-colors`}>
//                 {item.icon}
//               </span>
//               <span className={`text-sm font-bold uppercase italic tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* USER SECTION - With Improved Logout UI */}
//       <div className="mt-auto pt-6 border-t border-white/5">
//         <div className="px-4 mb-6">
//           <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-black italic">Operator Badge</p>
//           <p className="text-xs text-slate-300 mt-1.5 truncate font-bold tracking-tight">
//             {user?.email || 'OFFLINE_AGENT'}
//           </p>
//         </div>

//         {/* LOGOUT BUTTON - Integrated into sidebar */}
//         <button 
//           onClick={logout}
//           className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/60 hover:text-white hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20"
//         >
//           <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-[10px] font-black uppercase tracking-widest italic">Abort Session</span>
//         </button>
//       </div>
//     </aside>
//   );
// }






'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // useRouter add kiya
import {
  LayoutDashboard,
  CheckSquare,
  Archive,
  Settings,
  LogOut,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

export default function Sidebar({ user }: any) {
  const pathname = usePathname();
  const router = useRouter(); // Router initialize kiya
  const [profile, setProfile] = useState({
    name: '',
    email: user?.email || 'OFFLINE_AGENT'
  });

  // Sync with localStorage profile
  useEffect(() => {
    const updateProfile = () => {
      const saved = localStorage.getItem('operatorProfile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({
            name: parsed.name,
            email: parsed.email || user?.email || 'OFFLINE_AGENT'
          });
        } catch (e) {
          console.error("Profile sync error", e);
        }
      } else {
        setProfile(prev => ({ ...prev, email: user?.email || 'OFFLINE_AGENT' }));
      }
    };

    updateProfile();
    window.addEventListener('profileUpdate', updateProfile);
    return () => window.removeEventListener('profileUpdate', updateProfile);
  }, [user]);

  const isActive = (path: string) => pathname === path;

  // Manual Logout Function jo 100% kaam karega
  const handleLogout = () => {
    // 1. LocalStorage se user ka data saaf karo
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    
    // 2. Agar koi aur auth cookie hai to wo bhi clear ho sakti hai (Optional)
    
    // 3. User ko login page par phenk do
    router.push('/signin');
    
    // 4. Page refresh kar do taake state clear ho jaye
    router.refresh();
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <CheckSquare size={20} />, label: 'My Tasks', href: '/dashboard/tasks' },
    { icon: <MessageSquare size={20} />, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: <CalendarDays size={20} />, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: <Archive size={20} />, label: 'Archive', href: '/dashboard/archive' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-72 border-r border-white/5 bg-[#09090b] p-6 flex flex-col h-screen sticky top-0 z-50 overflow-hidden">

      {/* LOGO SECTION */}
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10 shrink-0">
          <LayoutDashboard className="text-white" size={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-white uppercase italic leading-none whitespace-nowrap">TaskNeon</span>
          <span className="text-[7px] font-black text-purple-500 uppercase tracking-[0.4em] mt-1 whitespace-nowrap">Operational OS</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, i) => {
          const active = isActive(item.href);
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group whitespace-nowrap ${
                active
                  ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.05)]'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <span className={`${active ? 'text-purple-500' : 'group-hover:text-purple-400'} transition-colors shrink-0`}>
                {item.icon}
              </span>
              <span className={`text-sm font-bold uppercase italic tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="mt-auto pt-6 border-t border-white/5 pb-8">
        <div className="px-6 mb-6">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-black italic">Operator Badge</p>
          <div className="mt-1.5 overflow-hidden">
            <p className="text-sm font-black text-white italic uppercase tracking-tight truncate">
              {profile.name || 'System Operator'}
            </p>
            <p className="text-[10px] text-slate-500 truncate font-bold tracking-tight">
              {profile.email}
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON - Calling handleLogout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:text-white hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Abort Session</span>
        </button>
      </div>
    </aside>
  );
}