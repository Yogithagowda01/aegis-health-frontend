import { useDashboard } from '../context/DashboardContext';
import { ShieldAlert, UserX, AlertTriangle, Eye, ArrowRight } from 'lucide-react';

export default function WatchlistPanel() {
  const { clinics, setSelectedClinicId, setActiveView } = useDashboard();

  // Flag clinics that are either in critical/warning state, missing doctors, or have critical stockouts
  const watchlistClinics = clinics
    .map(clinic => {
      const issues: string[] = [];
      if (clinic.doctorsCount < clinic.requiredDoctors) {
        issues.push(`Staff Shortage: ${clinic.requiredDoctors - clinic.doctorsCount} missing physician(s)`);
      }
      if (clinic.criticalStockouts.length > 0) {
        issues.push(`Critical Stockouts: ${clinic.criticalStockouts.join(', ')}`);
      }
      const occupancyRatio = clinic.bedOccupancy / clinic.bedCapacity;
      if (occupancyRatio > 0.85) {
        issues.push(`Extreme Bed Capacity: ${clinic.bedOccupancy}/${clinic.bedCapacity} beds occupied (${Math.round(occupancyRatio * 100)}%)`);
      }

      return {
        ...clinic,
        issues
      };
    })
    .filter(c => c.status === 'critical' || c.status === 'warning' || c.issues.length > 0);

  const handleInspect = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setActiveView('clinic-details');
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 select-none">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            District Watchlist & Critical Alerts
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Automated monitoring of resource depletion, staffing deficits, and stockouts
          </p>
        </div>
        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
          {watchlistClinics.length} Facilities Flagged
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-slate-400 font-semibold">
              <th className="py-3 px-4">Health Facility</th>
              <th className="py-3 px-4">Safety Status</th>
              <th className="py-3 px-4">Identified Operational Issues</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {watchlistClinics.map((clinic) => (
              <tr key={clinic.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-200">{clinic.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{clinic.type}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    clinic.status === 'critical'
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  }`}>
                    {clinic.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4 space-y-1">
                  {clinic.issues.map((issue, idx) => {
                    const isStaff = issue.includes('Staff');
                    const isStock = issue.includes('Stock');
                    const Icon = isStaff ? UserX : isStock ? AlertTriangle : ShieldAlert;
                    return (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Icon className={`w-3.5 h-3.5 ${
                          isStaff ? 'text-amber-400' : isStock ? 'text-rose-400' : 'text-rose-400'
                        }`} />
                        <span>{issue}</span>
                      </div>
                    );
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleInspect(clinic.id)}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ledger
                    </button>
                    <button
                      onClick={() => setActiveView('supply-hub')}
                      className="py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      AI Re-route
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
