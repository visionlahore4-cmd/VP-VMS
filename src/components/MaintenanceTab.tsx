import React, { useState, useEffect } from 'react';
import { MaintenanceEntry, Vehicle, Driver } from '../types';
import { Plus, Search, Edit2, Trash2, Wrench, Calendar, DollarSign, CheckCircle2, Clock, Printer, Info, X } from 'lucide-react';

interface MaintenanceTabProps {
  maintenanceEntries: MaintenanceEntry[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddMaintenanceEntry: (entry: Omit<MaintenanceEntry, 'id'>) => void;
  onEditMaintenanceEntry: (entry: MaintenanceEntry) => void;
  onDeleteMaintenanceEntry: (id: string) => void;
  onViewInvoice: (type: 'fuel' | 'maintenance', item: any) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenanceEntries,
  vehicles,
  drivers,
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

  // Form states from Screenshot 2
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('Maintenance');
  const [date, setDate] = useState('');
  const [partsCost, setPartsCost] = useState<number | ''>(''); // Cost (PKR)
  const [laborCost, setLaborCost] = useState<number | ''>(''); // Hidden / secondary cost, default 0
  const [status, setStatus] = useState<MaintenanceEntry['status']>('Completed');
  const [workshopName, setWorkshopName] = useState(''); // Vendor / Company name
  const [vendorAddress, setVendorAddress] = useState('');
  const [currentReading, setCurrentReading] = useState<number | ''>('');
  const [nextReading, setNextReading] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');

  const openAddModal = () => {
    setEditingEntry(null);
    setVehicleId(vehicles[0]?.id || '');
    setDriverId('');
    setMaintenanceType('Maintenance');
    setDate(new Date().toISOString().split('T')[0]);
    setPartsCost('');
    setLaborCost('');
    setStatus('Completed');
    setWorkshopName('');
    setVendorAddress('');
    setCurrentReading('');
    setNextReading('');
    setNotes('');
    
    // Default next maintenance date in 3 months
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);
    setNextMaintenanceDate(futureDate.toISOString().split('T')[0]);
    
    setIsModalOpen(true);
  };

  const openEditModal = (entry: MaintenanceEntry) => {
    setEditingEntry(entry);
    setVehicleId(entry.vehicleId);
    setDriverId(entry.driverId || '');
    setMaintenanceType(entry.maintenanceType || 'Maintenance');
    setDate(entry.date);
    setPartsCost(entry.partsCost !== 0 ? entry.partsCost : '');
    setLaborCost(entry.laborCost !== 0 ? entry.laborCost : '');
    setStatus(entry.status);
    setWorkshopName(entry.workshopName);
    setVendorAddress(entry.vendorAddress || '');
    setCurrentReading(entry.currentReading !== undefined ? entry.currentReading : '');
    setNextReading(entry.nextReading !== undefined ? entry.nextReading : '');
    setNotes(entry.notes || '');
    setNextMaintenanceDate(entry.nextMaintenanceDate || '');
    
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !workshopName.trim() || !date) return;

    const finalPartsCost = Number(partsCost) || 0;
    const finalLaborCost = Number(laborCost) || 0;

    // Default next service date in 3 months if empty
    let finalNextMaintDate = nextMaintenanceDate;
    if (!finalNextMaintDate) {
      const dObj = new Date(date);
      dObj.setDate(dObj.getDate() + 90);
      finalNextMaintDate = dObj.toISOString().split('T')[0];
    }

    const data = {
      date,
      vehicleId,
      driverId,
      maintenanceType,
      workshopName: workshopName.trim(),
      vendorAddress: vendorAddress.trim(),
      partsCost: finalPartsCost,
      laborCost: finalLaborCost,
      totalCost: finalPartsCost + finalLaborCost,
      nextMaintenanceDate: finalNextMaintDate,
      currentReading: currentReading !== '' ? Number(currentReading) : undefined,
      nextReading: nextReading !== '' ? Number(nextReading) : undefined,
      status,
      notes: notes.trim()
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 bg-[#161a33]/95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#121528]/80">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                Log Maintenance
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
              
              {/* Row 1: Vehicle & Driver */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vehicle *</label>
                  <select
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNo} — {v.modelName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Driver</label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Driver</option>
                    {drivers.filter(d => !d.isSelfDrive).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Maintenance Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Maintenance Type *</label>
                <select
                  required
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                >
                  <option value="Select Type">Select Type</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Engine Oil / Oil Filter">Engine Oil / Oil Filter</option>
                  <option value="Tire Replacement">Tire Replacement</option>
                  <option value="Brake Pad / Disc Service">Brake Pad / Disc Service</option>
                  <option value="Tuning & Plug Service">Tuning & Plug Service</option>
                  <option value="AC Filter / Service">AC Filter / Service</option>
                  <option value="Suspension & Steering">Suspension & Steering</option>
                  <option value="Body & Painting">Body & Painting</option>
                  <option value="Electrical & Wiring">Electrical & Wiring</option>
                  <option value="General Checkup">General Checkup</option>
                </select>
              </div>

              {/* Row 3: Date & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cost (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 5000"
                    value={partsCost}
                    onChange={(e) => setPartsCost(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Status */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MaintenanceEntry['status'])}
                  className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Row 5: Vendor Name & Vendor Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vendor / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Al-Madina Auto Workshop"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vendor Address</label>
                  <input
                    type="text"
                    placeholder="e.g. GT Road, Lahore"
                    value={vendorAddress}
                    onChange={(e) => setVendorAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Row 6: Current Reading & Next Reading */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Reading (KM)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45000"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Next Reading (KM)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={nextReading}
                    onChange={(e) => setNextReading(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              {/* Row 7: Notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe the maintenance work..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all border border-transparent hover:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold bg-[#6366f1] hover:bg-[#5053e1] text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
