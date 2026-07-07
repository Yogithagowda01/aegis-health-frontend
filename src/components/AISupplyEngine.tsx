import { useDashboard } from '../context/DashboardContext';
import { Cpu, ArrowRight, CheckCircle } from 'lucide-react';

export default function AISupplyEngine() {
  const { 
    recommendations, 
    isOptimizing, 
    optimizationStep, 
    triggerAIOptimization, 
    performTransfer,
    clinics 
  } = useDashboard();

  const getClinicName = (id: string) => {
    return clinics.find(c => c.id === id)?.name || id;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Gemini Logistics Optima Engine
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Calculates cross-facility inventory routing balances.</p>
        </div>
        
        <button
          onClick={triggerAIOptimization}
          disabled={isOptimizing}
          className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-extrabold text-[11px] rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
        >
          {isOptimizing ? 'Analyzing Models...' : 'Run Optimization'}
        </button>
      </div>

      {isOptimizing && (
        <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/20 mb-4 animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="text-xs text-emerald-400 font-mono font-bold">ACTIVE COMPILATION PIPELINE:</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 font-medium font-mono">{optimizationStep}</p>
        </div>
      )}

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[350px] pr-1">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xs font-medium border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-700" />
            No pending asset redistribution interventions required.
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-300 font-mono">{rec.item}</span>
                <span className="text-emerald-400 font-mono">Qty: {rec.quantity}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                <span className="truncate text-slate-400">{getClinicName(rec.source)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-emerald-400">{getClinicName(rec.destination)}</span>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal font-medium italic bg-slate-900/20 p-2 rounded-lg">
                &ldquo;{rec.justification}&rdquo;
              </p>

              <button
                onClick={() => performTransfer(rec.source)}
                className="w-full py-2 bg-slate-800 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 border border-slate-750 hover:border-emerald-500/20 font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1"
              >
                Execute Routing Directive
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Quick helper missing reference recovery helper template flag block
import { RefreshCcw } from 'lucide-react';