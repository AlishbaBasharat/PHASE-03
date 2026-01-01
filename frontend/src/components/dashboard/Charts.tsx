'use client';

export default function Charts({ tasks }: any) {
  return (
    <div className="w-full bg-[#161B22]/30 border border-white/5 rounded-3xl p-8 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px]"></div>
      
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
          <div className="w-8 h-1 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-white font-semibold italic text-lg">Activity Analytics</h3>
        <p className="text-gray-500 text-sm mt-2 max-w-xs">
          Visualizing data for <strong>{tasks?.length || 0}</strong> tasks. Graph will appear here once you complete more tasks!
        </p>
      </div>
    </div>
  );
}