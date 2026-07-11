import React, { useState } from 'react';
import { TokenTaxEntry, Vehicle, Driver } from '../types';
import { Plus, Search, Edit2, Trash2, FileText, Calendar, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface TokenTaxTabProps {
  tokenTaxEntries: TokenTaxEntry[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddTokenTaxEntry: (entry: Omit<TokenTaxEntry, 'id'>) => void;
  onEditTokenTaxEntry: (entry: TokenTaxEntry) => void;
  onDeleteTokenTaxEntry: (id: string) => void;
}

export const TokenTaxTab: React.FC<TokenTaxTabProps> = ({
  tokenTaxEntries,
  vehicles,
  drivers,
  onAddTokenTaxEntry,
  onEditTokenTaxEntry,
  onDeleteTokenTaxEntry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TokenTaxEntry | null>(null);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [tokenStatus, setTokenStatus] = useState<TokenTaxEntry['tokenStatus']>('Paid');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const openAddModal = () => {
    setEditingEntry(null);
    setVehicleId(vehicles[0]?.id || '');
    setAssignedName(drivers[0]?.name || '');
    setTokenStatus('Paid');
    // Set current date
    setStartDate(new Date().toISOString().split('T')[0]);
    // Set 1 year future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    setExpiryDate(futureDate.toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: TokenTaxEntry) => {
    setEditingEntry(entry);
    setVehicleId(entry.vehicleId);
    setAssignedName(entry.assignedName);
    setTokenStatus(entry.tokenStatus);
    setStartDate(entry.startDate);
    setExpiryDate(entry.expiryDate);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !assignedName.trim() || !startDate || !expiryDate) return;

    const data = {
      vehicleId,
      assignedName: assignedName.trim(),
      tokenStatus,
      startDate,
      expiryDate
    };

    if (editingEntry) {
      onEditTokenTaxEntry({ ...data, id: editingEntry.id });
    } else {
      onAddTokenTaxEntry(data);
    }
    setIsModalOpen(false);
  };

  // Filter entries
  const filteredEntries = tokenTaxEntries.filter(entry => {
    const vehicle = vehicles.find(v => v.id === entry.vehicleId);
    const matchText = 
      (vehicle?.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.assignedName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || entry.tokenStatus === statusFilter;

    return matchText && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" /> Token Tax & Environmental E-Tag
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track annual token tax payments, environmental fitness declarations, and toll road E-Tag validations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Regulatory Log
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tax filings by plate number or assigned officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          {['All', 'Paid', 'Unpaid'].map((statusOption) => (
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
            <p className="text-slate-400 font-medium text-sm">No token tax records registered.</p>
            <p className="text-xs text-slate-500 mt-1">Add a regulatory log to start keeping track of compliance dates.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Vehicle Unit</th>
                  <th className="py-3.5 px-4">Assigned Personnel</th>
                  <th className="py-3.5 px-4">Excise Token Status</th>
                  <th className="py-3.5 px-4">Filing Date</th>
                  <th className="py-3.5 px-4">Expiration Date</th>
                  <th className="py-3.5 px-4">Compliance Warning</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredEntries.map((entry) => {
                  const vehicle = vehicles.find(v => v.id === entry.vehicleId);
                  const isPaid = entry.tokenStatus === 'Paid';
                  
                  // Evaluate if expired relative to local date
                  const isExpired = new Date(entry.expiryDate) < new Date('2026-07-11');
                  const isNearExpiry = !isExpired && (new Date(entry.expiryDate) < new Date('2026-09-11')); // 2 months warning

                  return (
                    <tr key={entry.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Vehicle No */}
                      <td className="py-4 px-6 font-semibold text-emerald-400 font-mono text-xs">
                        <div className="flex flex-col">
                          <span>{vehicle?.vehicleNo || 'Deleted'}</span>
                          <span className="text-[10px] text-slate-500 font-sans font-medium">{vehicle?.modelName}</span>
                        </div>
                      </td>

                      {/* Assigned officer name */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-300">
                        {entry.assignedName}
                      </td>

                      {/* Token Tax status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {entry.tokenStatus}
                        </span>
                      </td>

                      {/* Filing Start date */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-400">
                        {entry.startDate}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-300">
                        {entry.expiryDate}
                      </td>

                      {/* Compliance Alert */}
                      <td className="py-4 px-4">
                        {isExpired ? (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                            REGULATION OVERDUE
                          </span>
                        ) : isNearExpiry ? (
                          <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            RENEWAL SOON
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                            COMPLIANT
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(entry)}
                            title="Edit Record"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Remove this regulatory token record permanently?')) {
                                onDeleteTokenTaxEntry(entry.id);
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

      {/* Modal Add / Edit centered */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                {editingEntry ? 'Edit Regulatory Token Log' : 'Issue New Excise Token Log'}
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

              {/* Assigned Personnel */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assigned Officer / Driver *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ahmed"
                  value={assignedName}
                  onChange={(e) => setAssignedName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  list="driver-names-datalist"
                />
                <datalist id="driver-names-datalist">
                  {drivers.map(d => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
                <span className="text-[10px] text-slate-500 block mt-1">Select from driver roster or type custom officer name</span>
              </div>

              {/* Token Tax Excise status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Excise Status</label>
                <select
                  value={tokenStatus}
                  onChange={(e) => setTokenStatus(e.target.value as TokenTaxEntry['tokenStatus'])}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                >
                  <option value="Paid">Paid (Compliant)</option>
                  <option value="Unpaid">Unpaid (Overdue)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Filing Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Expiration Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
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
                  {editingEntry ? 'Update Filing' : 'Save Excise Filing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
