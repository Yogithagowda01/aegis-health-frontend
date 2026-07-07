import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ClipboardList, PlusCircle, RefreshCcw, Landmark } from 'lucide-react';

export default function ClinicInventory() {
  const {
    clinics,
    selectedClinicId,
    setSelectedClinicId,
    selectedClinic,
    performStockUpdate
  } = useDashboard();

  const [updateCounts, setUpdateCounts] = useState<{ [itemName: string]: number }>({});
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Auto-select the first clinic if none is selected yet to prevent an empty screen
  useEffect(() => {
    if (!selectedClinicId && clinics.length > 0) {
      setSelectedClinicId(clinics[0].id);
    }
  }, [clinics, selectedClinicId, setSelectedClinicId]);

  if (!selectedClinic) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500 text-xs">
        {clinics.length === 0 ? "Loading operational health grid data..." : "Select a clinic from the command center to view its ledger."}
      </div>
    );
  }

  const handleInputChange = (itemName: string, val: string) => {
    const parsed = parseInt(val, 10);
    setUpdateCounts(prev => ({
      ...prev,
      [itemName]: isNaN(parsed) ? 0 : parsed
    }));
  };

  const handleApplyUpdate = async (itemName: string) => {
    const newQty = updateCounts[itemName];
    if (newQty === undefined || newQty < 0) return;

    setUpdatingItem(itemName);
    await performStockUpdate(selectedClinic.id, itemName, newQty);
    setUpdatingItem(null);
    
    // Clear input
    setUpdateCounts(prev => {
      const next = { ...prev };
      delete next[itemName];
      return next;
    });
  };

  const handleDemoPreset = async (itemName: string, level: 'zero' | 'safety') => {
    const item = selectedClinic.inventory.find(i => i.name === itemName);
    if (!item) return;

    const newQty = level === 'zero' ? 0 : item.safetyThreshold + 10;
    setUpdatingItem(itemName);
    await performStockUpdate(selectedClinic.id, itemName, newQty);
    setUpdatingItem(null);
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Clinic Header Info Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white leading-tight">
                {selectedClinic.name}
              </h2>
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                selectedClinic.status === 'critical'
                  ? 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                  : selectedClinic.status === 'warning'
                  ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
              }`}>
                {selectedClinic.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              Contact: {selectedClinic.contactNumber} &bull; Type: {selectedClinic.type}
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
          <label htmlFor="clinic-select" className="text-xs font-bold text-slate-400 shrink-0">
            Switch Facility:
          </label>
          <select
            id="clinic-select"
            value={selectedClinicId}
            onChange={(e) => setSelectedClinicId(e.target.value)}
            className="w-full md:w-60 py-2 px-3 bg-slate-950 hover:bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Feed */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-5 border-b border-slate-800/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              Safety Threshold Inventory Ledger
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time resource audits vs. minimum safety levels. Use demo presets or log manual logs to test active state updates.
            </p>
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {selectedClinic.inventory.map((item, index) => {
            const isSavingValue = updateCounts[item.name] !== undefined;
            const inputValue = updateCounts[item.name] ?? '';
            const isUpdating = updatingItem === item.name;

            // Calculate fill percentage relative to safety threshold (e.g. 100% capacity is safetyThreshold * 2)
            const maxGraphValue = item.safetyThreshold * 2;
            const pct = Math.min(100, Math.max(0, (item.currentStock / maxGraphValue) * 100));
            const thresholdPct = 50; // Safety threshold sits in the center (50%) of our gauge

            let fillClass = 'bg-emerald-500';
            let borderClass = 'border-slate-800 hover:border-emerald-500/20';
            
            if (item.status === 'critical') {
              fillClass = 'bg-rose-500';
              borderClass = 'border-rose-500/20 bg-rose-500/[0.01] hover:border-rose-500/45';
            } else if (item.status === 'warning') {
              fillClass = 'bg-amber-500';
              borderClass = 'border-amber-500/20 bg-amber-500/[0.01] hover:border-amber-500/45';
            }

            return (
              <div
                key={index}
                className={`border p-4.5 rounded-2xl transition-all duration-300 space-y-4 ${borderClass}`}
              >
                {/* Item Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-1 inline-block">
                      Safety Threshold: {item.safetyThreshold} {item.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold font-mono ${
                      item.status === 'critical'
                        ? 'text-rose-400'
                        : item.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {item.currentStock}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold font-mono"> {item.unit}</span>
                    <span className={`text-[8px] font-bold block uppercase mt-0.5 ${
                      item.status === 'critical'
                        ? 'text-rose-400'
                        : item.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-1 relative">
                  {/* Visual safety tick */}
                  <div
                    className="absolute bottom-4.5 w-0.5 h-3.5 bg-slate-400/70 z-10"
                    style={{ left: `${thresholdPct}%` }}
                    title="Safety Threshold Level"
                  >
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-slate-500 uppercase tracking-wider">
                      Min
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 relative">
                    <div
                      className={`h-full transition-all duration-500 ${fillClass}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[9px] font-medium text-slate-500">
                    <span>Depleted</span>
                    <span>Safety Margin</span>
                    <span>Excess Reserves</span>
                  </div>
                </div>

                {/* Simulated count action */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/40">
                  <input
                    type="number"
                    min="0"
                    placeholder="New qty"
                    value={inputValue}
                    onChange={(e) => handleInputChange(item.name, e.target.value)}
                    className="w-20 py-1.5 px-2 bg-slate-950 text-slate-200 text-[11px] font-mono border border-slate-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleApplyUpdate(item.name)}
                    disabled={isUpdating || !isSavingValue}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
                  >
                    {isUpdating ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <PlusCircle className="w-3 h-3" />}
                    Log Count
                  </button>

                  <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold">
                    <span className="text-slate-500">Demo Presets:</span>
                    <button
                      onClick={() => handleDemoPreset(item.name, 'zero')}
                      className="px-2 py-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 rounded font-mono"
                      title="Set inventory to 0"
                    >
                      Deplete
                    </button>
                    <button
                      onClick={() => handleDemoPreset(item.name, 'safety')}
                      className="px-2 py-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 rounded font-mono"
                      title="Restock to safety + 10 units"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
