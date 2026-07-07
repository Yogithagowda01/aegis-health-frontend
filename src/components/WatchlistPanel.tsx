import { useDashboard } from '../context/DashboardContext';
import { AlertTriangle, Bed, Package } from 'lucide-react';

export default function WatchlistPanel() {
  const { clinics, setSelectedClinicId, setActiveView } = useDashboard();

  // Dynamically filter and calculate watch items based on real inventory/bed counts
  const watchlistItems = clinics
    .map((clinic) => {
      const issues: string[] = [];

      // Check for any critical inventory items (stock value <= 15)
      const criticalInventoryItems = Object.entries(clinic.inventory || {})
        .filter(([_, stock]) => Number(stock) <= 15)
        .map(([name]) => name);

      if (criticalInventoryItems.length > 0) {
        issues.push(`Critical stockout risk: ${criticalInventoryItems.join(', ')}`);
      }

      // If the clinic status indicates warning or critical, or has high stockouts reported
      if (clinic.stockout_count > 0) {
        issues.push(`Reported ${clinic.stockout_count} severe item alert sequences`);
      }

      // Check operational capacity restrictions (Simulating alert if beds drop low)
      if (clinic.beds <= 10) {
        issues.push(`Emergency bed availability low (${clinic.beds} remaining)`);
      }

      return {
        ...clinic,
        issues
      };
    })
    .filter((clinic) => clinic.issues.length > 0 || clinic.status === 'critical' || clinic.status === 'warning');

  const handleClinicClick = (id: string) => {
    setSelectedClinicId(id);
    setActiveView('clinic-details');
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          High-Risk Watchlist
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Automated anomalies tracking regional resource failures.
        </p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[380px] custom-scrollbar">
        {watchlistItems.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs font-medium border border-dashed border-slate-800 rounded-xl">
            All regional facility nodes currently operating inside safe margins.
          </div>
        ) : (
          watchlistItems.map((clinic) => (
            <div
              key={clinic.id}
              onClick={() => handleClinicClick(clinic.id)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                clinic.status === 'critical'
                  ? 'bg-rose-500/[0.02] border-rose-500/20 hover:border-rose-500/40'
                  : 'bg-amber-500/[0.02] border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 leading-tight">
                    {clinic.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-medium font-mono mt-0.5">
                    ID: {clinic.id}
                  </p>
                </div>
                <span
                  className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    clinic.status === 'critical'
                      ? 'bg-rose-500/15 text-rose-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {clinic.status}
                </span>
              </div>

              <div className="space-y-1.5">
                {clinic.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400 font-medium leading-tight">
                    {issue.includes('stockout') ? (
                      <Package className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <Bed className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}