import { useDashboard } from '../context/DashboardContext';
import { Hospital, ShieldAlert, BedDouble, ArrowLeftRight } from 'lucide-react';

export default function HeroKPICards() {
  const { metrics, setActiveView } = useDashboard();

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl h-28"></div>
        ))}
      </div>
    );
  }

  const cardConfigs = [
    {
      title: 'PHCs Monitored',
      value: metrics.totalPHCs,
      desc: 'All nodes online (100%)',
      icon: Hospital,
      color: 'emerald',
      action: () => setActiveView('command-center'),
      borderStyle: 'border-slate-800/80 hover:border-emerald-500/30'
    },
    {
      title: 'Critical Stockouts',
      value: metrics.criticalStockouts,
      desc: metrics.criticalStockouts > 0 ? `${metrics.criticalStockouts} facilities need attention` : 'Optimal inventory levels',
      icon: ShieldAlert,
      color: 'rose',
      pulse: metrics.criticalStockouts > 0,
      action: () => setActiveView('command-center'),
      borderStyle: metrics.criticalStockouts > 0 ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-500/[0.02]' : 'border-slate-800/80 hover:border-emerald-500/30'
    },
    {
      title: 'Operational Beds Available',
      value: metrics.operationalBedsAvailable,
      desc: 'District capacity: 300 beds total',
      icon: BedDouble,
      color: 'emerald',
      action: () => setActiveView('clinic-details'),
      borderStyle: 'border-slate-800/80 hover:border-emerald-500/30'
    },
    {
      title: 'Pending Inter-PHC Transfers',
      value: metrics.pendingTransfers,
      desc: metrics.pendingTransfers > 0 ? `${metrics.pendingTransfers} routes calculated by AI` : 'All transfers resolved',
      icon: ArrowLeftRight,
      color: 'amber',
      action: () => setActiveView('supply-hub'),
      borderStyle: metrics.pendingTransfers > 0 ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-500/[0.01]' : 'border-slate-800/80 hover:border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cardConfigs.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.action}
            className={`border rounded-2xl p-5 transition-all duration-300 cursor-pointer flex justify-between items-start bg-slate-900/40 backdrop-blur-sm group select-none hover:shadow-lg hover:-translate-y-0.5 ${card.borderStyle}`}
          >
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                {card.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono leading-none">
                  {card.value}
                </span>
                {card.pulse && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400">
                {card.desc}
              </p>
            </div>
            
            <div className={`p-3 rounded-xl transition-all duration-300 border ${
              card.color === 'rose'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20'
                : card.color === 'amber'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20'
            }`}>
              <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
