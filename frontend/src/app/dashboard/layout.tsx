// src/app/dashboard/layout.tsx
// 'use client';
// import Sidebar from '@/components/dashboard/Sidebar';
// import { useAuth } from '@/hooks/useAuth';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();

//   return (
//     <div className="flex h-screen bg-[#0B0E14] overflow-hidden">
//       {/* Sidebar fixed on the left */}
//       <aside className="w-64 shrink-0 border-r border-white/5 hidden md:block">
//         <Sidebar user={user} />
//       </aside>

//       {/* Main content on the right */}
//       <main className="flex-1 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }







'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#09090b] overflow-hidden">

      {/* Sidebar - Fixed width, no overlap, no internal scrollbar */}
      <aside className="w-72 shrink-0 border-r border-white/5 hidden md:block z-20 overflow-hidden sticky top-0 h-screen">
        <Sidebar user={user} />
      </aside>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 min-w-0 h-full relative overflow-y-auto no-scrollbar z-10 bg-[#09090b]">
        {children}
      </main>
    </div>
  );
}



