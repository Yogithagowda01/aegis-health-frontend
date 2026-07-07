import { useDashboard } from '../context/DashboardContext';
import { Phone, Users, BedDouble, AlertTriangle, ArrowRight, Activity } from 'lucide-react';

export default function DistrictMap() {
  const {
    clinics,
    selectedClinicId,
    setSelectedClinicId,
    selectedClinic,
    recommendations,
    setActiveView
  } = useDashboard();

  // Coordinates mapping from percentage (0-100) to SVG canvas dimensions (800x500)
  const mapWidth = 800;
  const mapHeight = 500;

  const getCoordinates = (xPct: number, yPct: number) => {
    return {
      cx: (xPct / 100) * mapWidth,
      cy: (yPct / 100) * mapHeight
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Map Visual */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden select-none flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live District Telemetry Grid
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click pins to focus; animated vectors represent active AI redistributions
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-400 pulse-ring-emerald"></span> Stable
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-400"></span> Warning
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-400 pulse-ring-rose"></span> Critical
              </span>
            </div>
          </div>
        </div>

        {/* SVG Canvas Map */}
        <div className="relative w-full h-[400px] bg-slate-950/70 border border-slate-800/50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          {/* Cyber grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full object-contain relative z-10 p-4"
          >
            {/* Ambient District Boundary Outline */}
            <path
              d="M 120 80 Q 240 50 360 40 T 640 60 Q 750 120 780 220 T 740 380 Q 650 480 500 450 T 250 460 Q 150 410 80 320 T 80 180 Z"
              fill="rgba(15, 23, 42, 0.4)"
              stroke="rgba(71, 85, 105, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            
            {/* Active AI Redistribution Vectors (Transfer paths) */}
            {recommendations.map((rec) => {
              const srcClinic = clinics.find(c => c.id === rec.sourceFacilityId);
              const destClinic = clinics.find(c => c.id === rec.destFacilityId);
              if (!srcClinic || !destClinic) return null;

              const srcCoord = getCoordinates(srcClinic.x, srcClinic.y);
              const destCoord = getCoordinates(destClinic.x, destClinic.y);

              const strokeColor =
                rec.urgency === 'CRITICAL'
                  ? 'rgba(244, 63, 94, 0.7)' // rose
                  : rec.urgency === 'HIGH'
                  ? 'rgba(245, 158, 11, 0.7)' // amber
                  : 'rgba(16, 185, 129, 0.6)'; // emerald

              return (
                <g key={rec.id}>
                  {/* Glowing background vector line */}
                  <line
                    x1={srcCoord.cx}
                    y1={srcCoord.cy}
                    x2={destCoord.cx}
                    y2={destCoord.cy}
                    stroke={strokeColor}
                    strokeWidth="3"
                    className="opacity-20"
                  />
                  {/* Animated dotted flow line */}
                  <line
                    x1={srcCoord.cx}
                    y1={srcCoord.cy}
                    x2={destCoord.cx}
                    y2={destCoord.cy}
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    className="animate-[dash_20s_linear_infinite]"
                    style={{
                      strokeDashoffset: 100
                    }}
                  />
                </g>
              );
            })}

            {/* Clinic Pins */}
            {clinics.map((clinic) => {
              const { cx, cy } = getCoordinates(clinic.x, clinic.y);
              const isSelected = selectedClinicId === clinic.id;

              let colorClasses = {
                dot: 'fill-emerald-400',
                ring: 'stroke-emerald-500',
                bg: 'rgba(16, 185, 129, 0.2)'
              };

              if (clinic.status === 'critical') {
                colorClasses = {
                  dot: 'fill-rose-400',
                  ring: 'stroke-rose-500',
                  bg: 'rgba(244, 63, 94, 0.2)'
                };
              } else if (clinic.status === 'warning') {
                colorClasses = {
                  dot: 'fill-amber-400',
                  ring: 'stroke-amber-500',
                  bg: 'rgba(245, 158, 11, 0.2)'
                };
              }

              return (
                <g
                  key={clinic.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedClinicId(clinic.id)}
                >
                  {/* Invisible click target buffer to expand clickable area */}
                  <circle
                    id={`pin-${clinic.id}`}
                    cx={cx}
                    cy={cy}
                    r="24"
                    fill="transparent"
                    className="cursor-pointer animate-none"
                  />

                  {/* Glowing selection circle using native SVG animation to avoid scale/origin bugs */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill="none"
                      stroke="rgba(52, 211, 153, 0.6)"
                      strokeWidth="2"
                    >
                      <animate
                        attributeName="r"
                        values="10;25"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Node Outer Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 13 : 9}
                    fill={colorClasses.bg}
                    stroke={isSelected ? '#34d399' : 'rgba(71, 85, 105, 0.6)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-300 group-hover:stroke-slate-200 group-hover:stroke-[2px]"
                  />

                  {/* Pulsing ring for critical nodes using native animations */}
                  {clinic.status === 'critical' && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="none"
                      stroke="rgba(244, 63, 94, 0.6)"
                      strokeWidth="1.5"
                    >
                      <animate
                        attributeName="r"
                        values="9;18;9"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.9;0.3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Node Core Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 5 : 4.5}
                    className={`${colorClasses.dot} transition-all duration-300 group-hover:fill-white`}
                  />

                  {/* Dynamic Tooltip label on hover */}
                  <text
                    x={cx}
                    y={cy - (isSelected ? 22 : 16)}
                    textAnchor="middle"
                    className="fill-slate-300 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 pointer-events-none drop-shadow"
                  >
                    {clinic.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Focus State Metrics Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
        {selectedClinic ? (
          <div className="h-full flex flex-col justify-between space-y-5">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {selectedClinic.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 mt-1.5 inline-block">
                    {selectedClinic.type} Telemetry Focus
                  </span>
                </div>

                <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${
                  selectedClinic.status === 'critical'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : selectedClinic.status === 'warning'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                }`}>
                  {selectedClinic.status}
                </span>
              </div>

              {/* Status Details */}
              <div className="mt-6 space-y-4">
                {/* Bed occupancy */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-slate-500" /> Bed Occupancy
                    </span>
                    <span className="text-white">
                      {selectedClinic.bedOccupancy} / {selectedClinic.bedCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (selectedClinic.bedOccupancy / selectedClinic.bedCapacity) > 0.85
                          ? 'bg-rose-500'
                          : (selectedClinic.bedOccupancy / selectedClinic.bedCapacity) > 0.6
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${(selectedClinic.bedOccupancy / selectedClinic.bedCapacity) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium text-right">
                    {Math.round((selectedClinic.bedOccupancy / selectedClinic.bedCapacity) * 100)}% Capacity Occupied
                  </p>
                </div>

                {/* Doctor Count */}
                <div className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-300">Physicians Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-mono font-bold ${
                      selectedClinic.doctorsCount < selectedClinic.requiredDoctors
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}>
                      {selectedClinic.doctorsCount}
                    </span>
                    <span className="text-[10px] text-slate-500">/ {selectedClinic.requiredDoctors} Required</span>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-300">Hotline Endpoint</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{selectedClinic.contactNumber}</span>
                </div>
              </div>
            </div>

            {/* Critical Stockouts Watchlist */}
            <div className="space-y-3.5 mt-4">
              <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Critical Deficits
              </h4>
              {selectedClinic.criticalStockouts.length > 0 ? (
                <div className="space-y-2">
                  {selectedClinic.criticalStockouts.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs"
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {item}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                        OUT OF STOCK
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold text-center">
                  Optimal medical stock reserves maintained.
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveView('clinic-details')}
              className="w-full mt-6 py-3 px-4 bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-700/80 hover:text-white hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Inspect Safety Threshold Ledger
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            Select a facility from the map to inspect live metrics.
          </div>
        )}
      </div>
    </div>
  );
}
