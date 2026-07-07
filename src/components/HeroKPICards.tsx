import { useDashboard } from '../context/DashboardContext';
import { Activity, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';

export default function HeroKPICards() {
  const { metrics, clinics } = useDashboard();

  // Safeguard default fallbacks if metrics haven't loaded yet
  const totalPHCs = metrics?.phcs_monitored ?? clinics.length ?? 0;
  const criticalStockouts = metrics?.critical_stockouts ?? 0;
  const operationalBeds = metrics?.operational_beds ?? 0;
  const pendingTransfers = metrics?.pending_transfers ?? 0;

  const cards = [
    {
      title: 'Nodes Monitored',
      value: totalPHCs,
      description: 'Active facility data loops',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/5 border-emerald-500/10'
    },
    {
      title: 'Critical Stockouts',
      value: criticalStockouts,
      description: 'Requires immediate action',
      icon: AlertTriangle,
      color: criticalStockouts > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400',
      bg: criticalStockouts > 0 ? 'bg-rose-500/5 border-rose-500/15' : 'bg-slate-900/40 border-slate-800/80'
    },
    {
      title: 'Operational Beds',
      value: operationalBeds,
      description: 'District capacity overhead',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/5 border-blue-500/10'
    },
    {
      title: 'Pending Logistics En-Route',
      value: pendingTransfers,
      description: 'Active dynamic balancing orders',
      icon: Truck,
      color: 'text-amber-400',
      bg: 'bg-amber-500/5 border-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-4.5 rounded-2xl border transition-all duration-300 ${card.bg}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight leading-none">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2 rounded-xl bg-slate-950/40 border border-slate-800/50 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-2">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}