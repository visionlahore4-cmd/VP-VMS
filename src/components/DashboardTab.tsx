import React from 'react';
import { AppState, FuelEntry, MaintenanceEntry } from '../types';
import { 
  Car, 
  Bike, 
  Fuel, 
  Wrench, 
  Calendar, 
  User, 
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface DashboardTabProps {
  state: AppState;
  onNavigate: (tabId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ state, onNavigate }) => {
  const { vehicles, drivers, allotments, fuelEntries, maintenanceEntries } = state;

  // 1. Basic Stats Calculations
  const totalVehiclesCount = vehicles.length;
  const totalBikesCount = vehicles.filter(v => v.vehicleType === 'Motorcycle').length;
  const pendingMaintenanceCount = maintenanceEntries.filter(m => m.status === 'Pending').length;

  // 2. Monthly Fuel Cost (July 2026 as per current local time "2026-07-11")
  const currentMonthPrefix = '2026-07';
  const monthlyFuelSum = fuelEntries
    .filter(entry => entry.date.startsWith(currentMonthPrefix))
    .reduce((sum, entry) => sum + entry.totalAmount, 0);

  const formattedMonthlyFuel = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(monthlyFuelSum);

  // 3. Department allotment distributions for simple visual meter
  const departmentsList = ['General', 'SCM', 'Accounts', 'Sale', 'Admin', 'Production'];
  const departmentCounts = departmentsList.reduce((acc, dept) => {
    acc[dept] = allotments.filter(a => a.department === dept).length;
    return acc;
  }, {} as Record<string, number>);

  const maxAllotmentCount = Math.max(...Object.values(departmentCounts), 1);

  // 4. Vehicle Type distribution for SVG chart
  const vehicleTypes = ['Car', 'Motorcycle', 'Van', 'Truck'] as const;
  const typeCounts = vehicleTypes.reduce((acc, type) => {
    acc[type] = vehicles.filter(v => v.vehicleType === type).length;
    return acc;
  }, {} as Record<string, number>);

  const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;

  // 5. Recent Activity Feed (Combine latest 5 entries from Fuel + Maintenance logs sorted by date)
  interface ActivityItem {
    id: string;
    type: 'fuel' | 'maintenance';
    date: string;
    vehicleNo: string;
    vehicleModel: string;
    detail: string;
    cost: number;
    badge: string;
  }

  const recentActivities: ActivityItem[] = [
    ...fuelEntries.map((f): ActivityItem => {
      const v = vehicles.find(veh => veh.id === f.vehicleId);
      const d = drivers.find(drv => drv.id === f.driverId);
      return {
        id: f.id,
        type: 'fuel',
        date: f.date,
        vehicleNo: v?.vehicleNo || 'Unknown',
        vehicleModel: v?.modelName || 'Unknown',
        detail: `Refueled ${f.litres}L by ${d?.name || 'Driver'}`,
        cost: f.totalAmount,
        badge: `${f.calculatedAverage ? `${f.calculatedAverage} km/L` : 'First Fill'}`
      };
    }),
    ...maintenanceEntries.map((m): ActivityItem => {
      const v = vehicles.find(veh => veh.id === m.vehicleId);
      return {
        id: m.id,
        type: 'maintenance',
        date: m.date,
        vehicleNo: v?.vehicleNo || 'Unknown',
        vehicleModel: v?.modelName || 'Unknown',
        detail: `Workshop Service at ${m.workshopName}`,
        cost: m.totalCost,
        badge: m.status
      };
    })
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-emerald-500/10 glow-emerald/5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            VP Vehicle Management System
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time control workspace for corporate fleet telemetry, fuel calculations, and allotment logs.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto font-mono text-xs">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Operational Cycle:</span>
          <span className="text-emerald-400 font-semibold">July 2026</span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Vehicles */}
        <div 
          onClick={() => onNavigate('vehicles')}
          className="p-6 rounded-2xl glass-card border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Fleet</p>
              <h3 className="text-3xl font-bold font-display text-slate-100 mt-2 tracking-tight group-hover:text-emerald-400 transition-colors">
                {totalVehiclesCount} <span className="text-xs font-sans text-slate-500 font-medium">Units</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vehicles fully cataloged in system</span>
          </div>
        </div>

        {/* Total Bikes */}
        <div 
          onClick={() => onNavigate('vehicles')}
          className="p-6 rounded-2xl glass-card border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Motorcycles</p>
              <h3 className="text-3xl font-bold font-display text-slate-100 mt-2 tracking-tight group-hover:text-emerald-400 transition-colors">
                {totalBikesCount} <span className="text-xs font-sans text-slate-500 font-medium">Bikes</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
              <Bike className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-500">
            <span>Low-emission light operational transit</span>
          </div>
        </div>

        {/* Monthly Fuel Cost */}
        <div 
          onClick={() => onNavigate('fuel')}
          className="p-6 rounded-2xl glass-card border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Fuel Cost</p>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-slate-100 mt-2 tracking-tight group-hover:text-orange-400 transition-colors truncate">
                {formattedMonthlyFuel}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all duration-300">
              <Fuel className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-500">
            <span className="text-orange-400 font-semibold font-mono">July 2026 Cycle</span>
            <span>- {fuelEntries.filter(f => f.date.startsWith(currentMonthPrefix)).length} Entries</span>
          </div>
        </div>

        {/* Pending Maintenance */}
        <div 
          onClick={() => onNavigate('maintenance')}
          className="p-6 rounded-2xl glass-card border border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Workshop</p>
              <h3 className="text-3xl font-bold font-display text-slate-100 mt-2 tracking-tight group-hover:text-orange-400 transition-colors">
                {pendingMaintenanceCount} <span className="text-xs font-sans text-slate-500 font-medium">Bills</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all duration-300">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-500">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${pendingMaintenanceCount > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {pendingMaintenanceCount > 0 ? 'Urgent attention required' : 'All clear'}
            </span>
          </div>
        </div>

      </div>

      {/* Visual Charts & Department Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Allotments Chart Meter (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800/80">
          <h3 className="font-display font-bold text-slate-100 text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" /> Department Fleet Allotment
          </h3>
          <p className="text-xs text-slate-400 mt-1">Distribution of assigned transits across major business units.</p>
          
          <div className="mt-6 space-y-4">
            {departmentsList.map((dept) => {
              const count = departmentCounts[dept];
              const percentage = Math.round((count / maxAllotmentCount) * 100);
              return (
                <div key={dept} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{dept}</span>
                    <span className="text-slate-400 font-mono">
                      {count} {count === 1 ? 'allotment' : 'allotments'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900/80 h-2.5 rounded-full overflow-hidden border border-slate-800/50">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Distribution SVG Donut/Pie Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-100 text-lg flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-400" /> Fleet Segment Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-1">Inventory split by vehicle configuration models.</p>
          </div>

          <div className="flex items-center justify-center py-6">
            {/* Elegant SVG donut/pie representation */}
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background ring */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="4" />
                
                {/* Dynamically segments with colors */}
                {(() => {
                  let cumOffset = 0;
                  const colors = ['#10b981', '#f97316', '#3b82f6', '#ec4899'];
                  return vehicleTypes.map((type, index) => {
                    const pct = (typeCounts[type] / totalTypes) * 100;
                    if (pct === 0) return null;
                    const strokeDash = `${pct} ${100 - pct}`;
                    const currentOffset = cumOffset;
                    cumOffset += pct;
                    return (
                      <circle
                        key={type}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke={colors[index]}
                        strokeWidth="4.2"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={100 - currentOffset}
                        className="transition-all duration-300 hover:stroke-[5px] cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              {/* Centered label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-display text-slate-200">{totalVehiclesCount}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {vehicleTypes.map((type, index) => {
              const colors = ['bg-emerald-500', 'bg-orange-500', 'bg-blue-500', 'bg-pink-500'];
              const pct = Math.round((typeCounts[type] / totalTypes) * 100);
              return (
                <div key={type} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/40 border border-slate-900">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors[index]}`} />
                  <span className="text-slate-400 capitalize">{type}s:</span>
                  <span className="font-semibold text-slate-200 ml-auto font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Fleet Operations Feed */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800/80">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-100 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" /> Recent Fleet Operations Log
          </h3>
          <span className="text-xs text-slate-500">Live timeline feed</span>
        </div>
        
        <div className="mt-5 overflow-x-auto">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No operation logs currently populated. Create logs to display timeline activity.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Event Type</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Log Details</th>
                  <th className="pb-3 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {recentActivities.map((activity) => {
                  const isFuel = activity.type === 'fuel';
                  return (
                    <tr key={activity.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${isFuel ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {isFuel ? <Fuel className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                          </span>
                          <span className="font-medium text-xs uppercase tracking-wide">
                            {isFuel ? 'Fuel Fill' : 'Maint Bill'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-xs font-mono text-slate-400">
                        {activity.date}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{activity.vehicleNo}</span>
                          <span className="text-[10px] text-slate-500">{activity.vehicleModel}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs">{activity.detail}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            isFuel 
                              ? 'bg-emerald-500/15 text-emerald-400' 
                              : activity.badge === 'Pending' 
                                ? 'bg-orange-500/15 text-orange-400' 
                                : 'bg-slate-500/15 text-slate-400'
                          }`}>
                            {activity.badge}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right pr-2 font-mono font-bold text-slate-200 text-xs">
                        PKR {activity.cost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
