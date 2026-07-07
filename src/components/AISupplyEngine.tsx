import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Sparkles, ArrowRight, CheckCircle, Navigation, Loader2 } from 'lucide-react';

export default function AISupplyEngine() {
  const {
    recommendations,
    isOptimizing,
    optimizationStep,
    triggerAIOptimization,
    performTransfer
  } = useDashboard();

  const [executingId, setExecutingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleRunOptimization = () => {
    triggerAIOptimization();
  };

  const handleTransfer = async (recId: string) => {
    setExecutingId(recId);
    const success = await performTransfer(recId);
    setExecutingId(null);
    if (success) {
      setSuccessId(recId);
      setTimeout(() => setSuccessId(null), 3000);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner Control */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h2 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Gemini Logistics Redistribution Engine
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Run real-time supply chain optimizations. Gemini maps local PHC usage profiles, safety stock thresholds, and epidemiological forecasts to resolve deficits dynamically.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="relative group overflow-hidden py-3.5 px-6 rounded-xl font-bold text-xs transition-all duration-300 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0 flex items-center gap-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Computing Grid...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              Run AI Optimization
            </>
          )}
        </button>
      </div>

      {/* Loading Simulated State */}
      {isOptimizing && (
        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-10 flex flex-col items-center justify-center space-y-6 text-center shadow-lg relative overflow-hidden">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Spinning glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
            {/* Scanning radar sweep */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center pulse-ring-emerald">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-200">Gemini Clinical Engine Active</p>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {optimizationStep}
            </div>
          </div>

          <div className="w-64 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[60%] animate-[pulse_1.5s_infinite]"></div>
          </div>
        </div>
      )}

      {/* Recommendations Feed */}
      {!isOptimizing && (
        <div className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Redistribution Recommendations
            </h3>
            <span className="text-[10px] font-semibold text-slate-500">
              Generated: Just now
            </span>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => {
                const isExecuting = executingId === rec.id;
                
                let urgencyBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                if (rec.urgency === 'CRITICAL') {
                  urgencyBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse';
                } else if (rec.urgency === 'HIGH') {
                  urgencyBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                }

                return (
                  <div
                    key={rec.id}
                    className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-300 flex flex-col lg:flex-row justify-between gap-5 relative overflow-hidden"
                  >
                    {/* Urgency and Transfer Header */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${urgencyBadge}`}>
                          {rec.urgency} URGENCY
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Route ID: {rec.id.toUpperCase()}
                        </span>
                      </div>

                      {/* Direction flow graphics */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-slate-950/40 border border-slate-850 p-3 rounded-xl max-w-2xl">
                        <div className="flex-1 min-w-[120px]">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">SOURCE</span>
                          <span className="text-xs font-bold text-white">{rec.sourceFacilityName}</span>
                        </div>

                        {/* Visual Arrow Connector */}
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {rec.quantity} {rec.unit}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <div className="w-8 sm:w-16 border-t border-slate-700 border-dashed"></div>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-[9px] font-mono font-semibold text-slate-500 mt-1">
                            {rec.item}
                          </span>
                        </div>

                        <div className="flex-1 min-w-[120px] text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">DESTINATION</span>
                          <span className="text-xs font-bold text-white">{rec.destFacilityName}</span>
                        </div>
                      </div>

                      {/* Justification Box */}
                      <div className="p-4 bg-slate-950/30 border border-slate-850/80 rounded-xl max-w-3xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Gemini Clinical Justification Analysis
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {rec.justification}
                        </p>
                      </div>
                    </div>

                    {/* Operational Action Panel */}
                    <div className="flex flex-col justify-center items-start lg:items-end shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-4 lg:pt-0 lg:pl-6 min-w-[160px]">
                      <div className="text-[10px] font-semibold text-slate-500 mb-2">
                        Admin Dispatch Control
                      </div>
                      <button
                        onClick={() => handleTransfer(rec.id)}
                        disabled={isExecuting}
                        className="w-full lg:w-auto py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isExecuting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>
                            <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                            Authorize Shift
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <CheckCircle className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200">No Pending Recommended Transfers</p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  Click 'Run AI Optimization' above to query active Guntur medical inventories and generate redistribution routes.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Operation Log Notification */}
      {successId && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3.5 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md animate-[slideIn_0.3s_ease-out]">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="text-xs font-bold">Transfer Authorization Logged</p>
            <p className="text-[10px] text-emerald-300 mt-0.5">Supply redistribution dispatched to logistics vehicles.</p>
          </div>
        </div>
      )}
    </div>
  );
}
