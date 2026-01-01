'use client';

interface StatsProps { active: number; completed: number; total: number; }

export default function StatsCards({ active, completed, total }: StatsProps) {
  const cards = [
    { label: 'Active Tasks', value: active, color: 'text-purple-400', glow: 'shadow-purple-500/20' },
    { label: 'Completed', value: completed, color: 'text-green-400', glow: 'shadow-green-500/10' },
    { label: 'Total Tasks', value: total, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div key={i} className={`bg-[#161B22]/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all ${card.glow}`}>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className={`text-4xl font-black ${card.color}`}>{card.value}</h2>
            <span className="text-[10px] text-gray-600 font-mono italic">live data</span>
          </div>
        </div>
      ))}
    </div>
  );
}