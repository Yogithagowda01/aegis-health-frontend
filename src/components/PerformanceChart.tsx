import { useDashboard } from '../context/DashboardContext';

export default function PerformanceChart() {
  const { clinics } = useDashboard();

  // Map out facility nodes to display dynamic bed metrics
  const chartData = clinics.map(clinic => {
    const totalBeds = clinic.beds || 0;
    // Simulate active capacity load profiles safely based on bed counts
    const occupancyRate = totalBeds > 30 ? 0.75 : 0.45;
    const occupied = Math.round(totalBeds * occupancyRate);

    return {
      name: clinic.name,
      total: totalBeds,
      occupied: occupied,
      available: Math.max(0, totalBeds - occupied)
    };
  });

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Capacity Allocation Matrix</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Real-time occupancy status vs total designated node bedding overhead.</p>
      </div>

      <div className="flex-1 space-y-3.5 flex flex-col justify-center">
        {chartData.length === 0 ? (
          <div className="text-center py-6 text-slate-600 text-xs font-medium">
            Awaiting grid metrics serialization...
          </div>
        ) : (
          chartData.map((data, idx) => {
            const occupiedPct = Math.min(100, (data.occupied / (data.total || 1)) * 100);
            
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-300 truncate max-w-[180px] font-bold">{data.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    <strong className="text-slate-200">{data.occupied}</strong>/{data.total} Beds Occupied
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 flex">
                  <div 
                    style={{ width: `${occupiedPct}%` }} 
                    className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}