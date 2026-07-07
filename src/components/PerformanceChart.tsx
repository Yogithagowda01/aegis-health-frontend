import { useDashboard } from '../context/DashboardContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function PerformanceChart() {
  const { clinics } = useDashboard();

  const data = clinics.map((c) => ({
    name: c.name
      .replace(' Central PHC', '')
      .replace(' CHC', '')
      .replace(' Area Hospital', ' AH')
      .replace(' PHC', ''),
    Capacity: c.bedCapacity,
    Occupied: c.bedOccupancy,
    Available: c.bedCapacity - c.bedOccupancy
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg text-xs space-y-1 font-semibold">
          <p className="text-white font-bold mb-1">{label}</p>
          <p className="text-blue-400">Bed Capacity: {payload[0].value}</p>
          <p className="text-emerald-400">Beds Occupied: {payload[1].value}</p>
          <p className="text-slate-400">Available: {payload[0].value - payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 select-none">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            District Bed Allocation Telemetry
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Comparative analysis of operational bed capacity and occupancy rates by health center
          </p>
        </div>
      </div>

      <div className="w-full h-80 bg-slate-950/40 border border-slate-850/60 rounded-xl p-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: 10, fontWeight: 600, color: '#94a3b8' }}
            />
            <Bar
              dataKey="Capacity"
              fill="#1e293b"
              radius={[4, 4, 0, 0]}
              stroke="#334155"
              strokeWidth={1}
            />
            <Bar
              dataKey="Occupied"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              stroke="#059669"
              strokeWidth={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
