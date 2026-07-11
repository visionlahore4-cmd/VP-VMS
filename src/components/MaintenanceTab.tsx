import React, { useState, useEffect } from 'react';
import { MaintenanceEntry, Vehicle } from '../types';
import { Plus, Search, Edit2, Trash2, Wrench, Calendar, DollarSign, CheckCircle2, Clock, Printer, Info, X } from 'lucide-react';

interface MaintenanceTabProps {
  maintenanceEntries: MaintenanceEntry[];
  vehicles: Vehicle[];
  onAddMaintenanceEntry: (entry: Omit<MaintenanceEntry, 'id'>) => void;
  onEditMaintenanceEntry: (entry: MaintenanceEntry) => void;
  onDeleteMaintenanceEntry: (id: string) => void;
  onViewInvoice: (type: 'fuel' | 'maintenance', item: any) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenanceEntries,
  vehicles,
  onAddMaintenanceEntry,
  onEditMaintenanceEntry,
  onDeleteMaintenanceEntry,
  onViewInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MaintenanceEntry | null>(null);

  // Form states
  const [date, setDate] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [partsCost, setPartsCost] = useState<number | ''>('');
  const [laborCost, setLaborCost] = useState<number | ''>('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [status, setStatus] = useState<MaintenanceEntry['status']>('Pending');

  // Auto-calculate Total Cost = Parts Cost + Labor Cost
  useEffect(() => {
    const p = Number(partsCost) || 0;
    const l = Number(laborCost) || 0;
    setTotalCost(p + l);
  }, [partsCost, laborCost]);

  const openAddModal = () => {
    setEditingEntry(null);
    setDate(new Date().toISOString().split('T')[0]);
    setVehicleId(vehicles[0]?.id || '');
    setWorkshopName('');
    setPartsCost('');
    setLaborCost('');
    // Set default next maintenance in 3 months (90 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);
    setNextMaintenanceDate(futureDate.toISOString().split('T')[0]);
    setStatus('Pending');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: MaintenanceEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setVehicleId(entry.vehicleId);
    setWorkshopName(entry.workshopName);
    setPartsCost(entry.partsCost);
    setLaborCost(entry.laborCost);
    setNextMaintenanceDate(entry.nextMaintenanceDate);
    setStatus(entry.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !workshopName.trim() || !date || !nextMaintenanceDate) return;

    const calculatedTotal = (Number(partsCost) || 0) + (Number(laborCost) || 0);

    const data = {
      date,
      vehicleId,
      workshopName: workshopName.trim(),
      partsCost: Number(partsCost) || 0,
      laborCost: Number(laborCost) || 0,
      totalCost: calculatedTotal,
      nextMaintenanceDate,
      status
    };

    if (editingEntry) {
      onEditMaintenanceEntry({ ...data, id: editingEntry.id });
    } else {
      onAddMaintenanceEntry(data);
    }
    setIsModalOpen(false);
  };

  // Filter maintenance records
  const filteredEntries = maintenanceEntries.filter(entry => {
    const vehicle = vehicles.find(v => v.id === entry.vehicleId);
    const matchText = 
      (vehicle?.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.workshopName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || entry.status === statusFilter;

    return matchText && matchStatus;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-400" /> Workshop & Maintenance Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Log replacement parts and mechanical labor bills, configure service schedules, and check pending repairs.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Log Service Bill
        </button>
      </div>

      {/* Control Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search workshop log by vehicle plate, workshop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          {['All', 'Pending', 'Completed'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setStatusFilter(statusOption)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                statusFilter === statusOption
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of details or Table */}
      <div className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No maintenance bills cataloged.</p>
            <p className="text-xs text-slate-500 mt-1">Create a service bill when repairs or routine tune-ups occur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Service Date</th>
                  <th className="py-3.5 px-4">Vehicle Unit</th>
                  <th className="py-3.5 px-4">Workshop Facility</th>
                  <th className="py-3.5 px-4">Parts Cost</th>
                  <th className="py-3.5 px-4">Labor Cost</th>
                  <th className="py-3.5 px-4">Total Bill</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Next Inspection</th>
                  <th className="py-3.5 px-4 text-right pr-6">Receipt / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredEntries.map((entry) => {
                  const vehicle = vehicles.find(v => v.id === entry.vehicleId);
                  const isCompleted = entry.status === 'Completed';

                  return (
                    <tr key={entry.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Service Date */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-300">
                        {entry.date}
                      </td>

                      {/* Vehicle plate */}
                      <td className="py-4 px-4 font-semibold text-emerald-400 font-mono text-xs">
                        <div className="flex flex-col">
                          <span>{vehicle?.vehicleNo || 'Deleted Vehicle'}</span>
                          <span className="text-[10px] text-slate-500 font-sans font-medium">{vehicle?.modelName}</span>
                        </div>
                      </td>

                      {/* Workshop facility */}
                      <td className="py-4 px-4 text-xs text-slate-200">
                        {entry.workshopName}
                      </td>

                      {/* Parts Cost */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-400">
                        PKR {entry.partsCost.toLocaleString()}
                      </td>

                      {/* Labor Cost */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-400">
                        PKR {entry.laborCost.toLocaleString()}
                      </td>

                      {/* Total Cost */}
                      <td className="py-4 px-4 text-xs font-bold font-mono text-emerald-400">
                        PKR {entry.totalCost.toLocaleString()}
                      </td>

                      {/* Status indicator */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                          isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {entry.status}
                        </span>
                      </td>

                      {/* Next inspection due */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-400">
                        {entry.nextMaintenanceDate}
                      </td>

                      {/* Print and operations actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewInvoice('maintenance', entry)}
                            title="Print Workshop Invoice"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(entry)}
                            title="Edit Record"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this maintenance record permanently?')) {
                                onDeleteMaintenanceEntry(entry.id);
                              }
                            }}
                            title="Delete Record"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-red-500/20 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Centered Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                {editingEntry ? 'Edit Workshop Bill Log' : 'Log New Mechanical Repair Bill'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Service Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Status selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Repair Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MaintenanceEntry['status'])}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Choose Vehicle *</label>
                  <select
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNo} — {v.modelName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workshop Facility name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Workshop Facility *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Township Motors"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Parts Cost */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Parts Cost (PKR) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 8500"
                    value={partsCost}
                    onChange={(e) => setPartsCost(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>

                {/* Labor Cost */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Labor Cost (PKR) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3500"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Live calculated Total Cost */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Total Computed Bill</label>
                  <div className="w-full px-3 py-2 bg-slate-950 rounded-lg text-sm font-bold text-emerald-400 border border-slate-850 flex items-center h-9 font-mono">
                    PKR {totalCost.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Parts + Labor combined</span>
                </div>

                {/* Next scheduled maintenance */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Next Service Due *</label>
                  <input
                    type="date"
                    required
                    value={nextMaintenanceDate}
                    onChange={(e) => setNextMaintenanceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all glow-emerald cursor-pointer"
                >
                  {editingEntry ? 'Update Bill' : 'Save Workshop Log'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
