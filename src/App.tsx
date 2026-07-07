import { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import HeroKPICards from './components/HeroKPICards';
import DistrictMap from './components/DistrictMap';
import WatchlistPanel from './components/WatchlistPanel';
import AISupplyEngine from './components/AISupplyEngine';
import ClinicInventory from './components/ClinicInventory';
import PerformanceChart from './components/PerformanceChart';
import { Activity, Clock } from 'lucide-react';

function DashboardShell() {
  const { activeView } = useDashboard();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen font-sans overflow-hidden">
      {/* Permanent Sidebar Navigation */}
      <Sidebar />

      {/* Main Application Container */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col justify-between">
        {/* Top Header Controls Bar */}
        <header className="px-8 py-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">SYSTEM TELEMETRY GATEWAY</span>
              <span className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400 rounded">
                SECURE SSL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(time)}</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold">{formatTime(time)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300">API SYNCED</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          {/* Permanent Summary KPI Cards */}
          <HeroKPICards />

          {/* Dynamic View Router */}
          <div className="transition-opacity duration-300">
            {activeView === 'command-center' && (
              <div className="space-y-8">
                {/* Simulated interactive map & focused telemetry */}
                <DistrictMap />
                
                {/* Watchlist & analytical charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <WatchlistPanel />
                  <PerformanceChart />
                </div>
              </div>
            )}

            {activeView === 'supply-hub' && (
              <AISupplyEngine />
            )}

            {activeView === 'clinic-details' && (
              <ClinicInventory />
            )}
          </div>
        </div>

        {/* Footer info for members of parliament presentation */}
        <footer className="px-8 py-4 border-t border-slate-900 bg-slate-950 text-center text-[10px] text-slate-600 font-mono font-medium">
          AP STATE HEALTH DEV TASKFORCE &bull; SMART SUPPLY SYSTEM PROTOTYPE (TRACK 3) &bull; POWERED BY GEMINI 2.0
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  );
}
