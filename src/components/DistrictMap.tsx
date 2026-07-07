import { useDashboard } from '../context/DashboardContext';
import { MapPin } from 'lucide-react';

export default function DistrictMap() {
  const { clinics, selectedClinicId, setSelectedClinicId } = useDashboard();

  // Basic scaling function to map GPS Coordinates safely onto a beautiful responsive dashboard grid bounding box
  const getCoordinates = (lat: number, lng: number) => {
    const minLat = 16.2, maxLat = 16.4;
    const minLng = 80.3, maxLng = 80.6;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

    return { 
      x: Math.min(90, Math.max(10, x)), 
      y: Math.min(90, Math.max(10, y)) 
    };
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-full flex flex-col min-h-[400px]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Regional Telemetry Node Coordinates</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Geospatial layout engine charting live emergency grid points.</p>
      </div>

      <div className="flex-1 w-full bg-slate-950 rounded-xl relative border border-slate-900 overflow-hidden min-h-[300px]">
        {/* Subtle abstract coordinate grid alignment markers */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.02]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border-t border-l border-slate-400" />
          ))}
        </div>

        {clinics.map((clinic) => {
          const { x, y } = getCoordinates(clinic.lat || 16.3, clinic.lng || 80.4);
          const isSelected = clinic.id === selectedClinicId;

          let colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (clinic.status === 'critical') colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
          else if (clinic.status === 'warning') colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

          return (
            <button
              key={clinic.id}
              onClick={() => setSelectedClinicId(clinic.id)}
              style={{ top: `${y}%`, left: `${x}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex items-center p-1.5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${colorClass} ${
                isSelected ? 'ring-2 ring-emerald-500 scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-[9px] font-bold px-0 group-hover:pl-1 whitespace-nowrap">
                {clinic.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}