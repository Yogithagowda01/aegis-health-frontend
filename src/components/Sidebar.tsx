import { useDashboard } from '../context/DashboardContext';
import type { ViewType } from '../context/DashboardContext';
import { LayoutDashboard, Sparkles, ClipboardList, ShieldAlert, Award } from 'lucide-react';

export default function Sidebar() {
  const { activeView, setActiveView, recommendations, clinics } = useDashboard();

  const activeTransfersCount = recommendations.length;
  const criticalClinicsCount = clinics.filter(c => c.status === 'critical').length;

  const menuItems = [
    {
      id: 'command-center' as ViewType,
      label: 'District Command Center',
      icon: LayoutDashboard,
      badge: criticalClinicsCount > 0 ? { count: criticalClinicsCount, type: 'critical' } : null,
      desc: 'Real-time telemedicine & beds status'
    },
    {
      id: 'supply-hub' as ViewType,
      label: 'AI Redistribution Engine',
      icon: Sparkles,
      badge: activeTransfersCount > 0 ? { count: activeTransfersCount, type: 'info' } : null,
      desc: 'Gemini-driven logistics routing'
    },
    {
      id: 'clinic-details' as ViewType,
      label: 'Clinic Assets Ledger',
      icon: ClipboardList,
      badge: null,
      desc: 'Safety threshold telemetry'
    }
  ];

  return (
    <aside className="w-80 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none">
      {/* Header Info */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Award className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              PHC Sentinel
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Guntur District
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3">
            Primary Navigation
          </p>
          <nav className="mt-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group border ${
                    isActive
                      ? 'bg-slate-800/80 border-emerald-500/30 text-white shadow-md'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm leading-none">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-none font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full leading-none min-w-5 text-center ${
                        item.badge.type === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 relative overflow-hidden">
            <span className="text-sm font-bold text-slate-300">AP</span>
            {/* Online Indicator */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200">District Admin</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono">ID: AP-GNT-DIS-452</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-medium">Redistributions Completed</span>
            <span className="text-emerald-400 font-bold font-mono">14</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full w-[70%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
