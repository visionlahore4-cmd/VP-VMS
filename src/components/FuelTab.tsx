import React, { useState, useEffect } from 'react';
import { FuelEntry, Vehicle, Driver } from '../types';
import { Plus, Search, Edit2, Trash2, Fuel, Calendar, Gauge, CreditCard, Droplet, Printer, Info, X } from 'lucide-react';

interface FuelTabProps {
  fuelEntries: FuelEntry[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddFuelEntry: (entry: Omit<FuelEntry, 'id'>) => void;
  onEditFuelEntry: (entry: FuelEntry) => void;
  onDeleteFuelEntry: (id: string) => void;
  onViewInvoice: (type: 'fuel' | 'maintenance', item: any) => void;
}

export const FuelTab: React.FC<FuelTabProps> = ({
  fuelEntries,
  vehicles,
  drivers,
  onAddFuelEntry,
  onEditFuelEntry,
  onDeleteFuelEntry,
  onViewInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FuelEntry | null>(null);

  // Form states
  const [date, setDate] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [litres, setLitres] = useState<number | ''>('');
  const [ratePerLitre, setRatePerLitre] = useState<number | ''>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [odometerReading, setOdometerReading] = useState<number | ''>('');
  const [pumpName, setPumpName] = useState('');

  // Math logic: Automatically calculate Total Amount = Litres * Rate (no decimals)
  useEffect(() => {
    const l = Number(litres) || 0;
    const r = Number(ratePerLitre) || 0;
    setTotalAmount(Math.round(l * r));
  }, [litres, ratePerLitre]);

  const openAddModal = () => {
    setEditingEntry(null);
    setDate(new Date().toISOString().split('T')[0]);
    setVehicleId(vehicles[0]?.id || '');
    setDriverId(drivers[0]?.id || '');
    setLitres('');
    setRatePerLitre(272); // Default realistic PKR rate per litre
    setOdometerReading('');
    setPumpName('Shell Jail Road, LHR');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: FuelEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setVehicleId(entry.vehicleId);
    setDriverId(entry.driverId);
    setLitres(entry.litres);
    setRatePerLitre(entry.ratePerLitre);
    setOdometerReading(entry.odometerReading);
    setPumpName(entry.pumpName);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !driverId || !date || !litres || !ratePerLitre || !odometerReading) return;

    // Check Odometer is logical
    const odoValue = Number(odometerReading);
    
    // Find prior entries for this vehicle
    const vehicleLogs = fuelEntries
      .filter(f => f.vehicleId === vehicleId && (!editingEntry || f.id !== editingEntry.id))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (vehicleLogs.length > 0) {
      const lastLog = vehicleLogs[vehicleLogs.length - 1];
      if (odoValue < lastLog.odometerReading) {
        if (!window.confirm(`Warning: The entered Odometer reading (${odoValue}) is less than the vehicle's last recorded reading (${lastLog.odometerReading}). Do you want to save anyway?`)) {
          return;
        }
      }
    }

    const calculatedTotal = Math.round(Number(litres) * Number(ratePerLitre));

    const data = {
      date,
      vehicleId,
      driverId,
      litres: Number(litres),
      ratePerLitre: Number(ratePerLitre),
      totalAmount: calculatedTotal,
      odometerReading: odoValue,
      pumpName: pumpName.trim() || 'Unknown Pump'
    };

    if (editingEntry) {
      onEditFuelEntry({ ...data, id: editingEntry.id });
    } else {
      onAddFuelEntry(data);
    }
    setIsModalOpen(false);
  };

  // Fuel Average Helper: Compares current odometer with previous odometer for that vehicle
  const getFuelAverageForEntry = (entry: FuelEntry) => {
    // 1. Get all logs for same vehicle
    const vLogs = fuelEntries
      .filter(f => f.vehicleId === entry.vehicleId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.odometerReading - b.odometerReading);

    // 2. Find position of current entry
    const idx = vLogs.findIndex(l => l.id === entry.id);

    if (idx > 0) {
      const prevEntry = vLogs[idx - 1];
      const diffOdo = entry.odometerReading - prevEntry.odometerReading;
      if (diffOdo > 0) {
        return (diffOdo / entry.litres).toFixed(1);
      }
    }
    return null;
  };

  // Filter fuel entries
  const filteredFuelEntries = fuelEntries.filter(entry => {
    const vehicle = vehicles.find(v => v.id === entry.vehicleId);
    const driver = drivers.find(d => d.id === entry.driverId);

    const matchText = 
      (vehicle?.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pumpName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVehicle = selectedVehicleId === 'All' || entry.vehicleId === selectedVehicleId;

    return matchText && matchVehicle;
  }).sort((a, b) => b.date.localeCompare(a.date)); // descending chronologically (newest first)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Fuel className="w-6 h-6 text-emerald-400 animate-pulse" /> Fuel Ledger & Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Log fuel receipts, track exact expenditures, and automatically evaluate transit fuel averages (km/L).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Fuel Receipt
        </button>
      </div>

      {/* Controls & Filter */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search fuel log by driver name, plate, pump name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none placeholder-slate-500"
          />
        </div>

        {/* Vehicle filter dropdown */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <Droplet className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">Filter Vehicle:</span>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:ring-0 outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="All">All Vehicles</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.vehicleNo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log list table */}
      <div className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
        {filteredFuelEntries.length === 0 ? (
          <div className="py-16 text-center">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No fuel logs found.</p>
            <p className="text-xs text-slate-500 mt-1">Record a fuel slip to start monitoring calculations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Refuel Date</th>
                  <th className="py-3.5 px-4">Vehicle Unit</th>
                  <th className="py-3.5 px-4">Assigned Driver</th>
                  <th className="py-3.5 px-4">Fuel Vol & Rate</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Odometer Reading</th>
                  <th className="py-3.5 px-4">Fuel Average</th>
                  <th className="py-3.5 px-4">Fuel Station</th>
                  <th className="py-3.5 px-4 text-right pr-6">Receipt / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredFuelEntries.map((entry) => {
                  const vehicle = vehicles.find(v => v.id === entry.vehicleId);
                  const driver = drivers.find(d => d.id === entry.driverId);
                  const fuelAverage = getFuelAverageForEntry(entry);

                  return (
                    <tr key={entry.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Date */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-300">
                        {entry.date}
                      </td>

                      {/* Vehicle plate */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-emerald-400 font-mono text-xs">{vehicle?.vehicleNo || 'Unknown'}</span>
                          <span className="text-[10px] text-slate-500">{vehicle?.modelName || 'Deleted'}</span>
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-300">
                        <div className="flex flex-col gap-0.5">
                          <span>{driver?.name || 'Deleted Driver'}</span>
                          {driver?.isSelfDrive && (
                            <span className="inline-flex items-center w-max px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20">
                              Self Drive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Fuel Volume and Rate */}
                      <td className="py-4 px-4 text-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200">{entry.litres} Litres</span>
                          <span className="text-[10px] text-slate-500">PKR {entry.ratePerLitre}/L</span>
                        </div>
                      </td>

                      {/* Calculated Total Amount */}
                      <td className="py-4 px-4 text-xs font-bold text-emerald-400 font-mono">
                        PKR {entry.totalAmount.toLocaleString()}
                      </td>

                      {/* Odometer */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-300">
                        {entry.odometerReading.toLocaleString()} km
                      </td>

                      {/* Computed Fuel Average logic */}
                      <td className="py-4 px-4">
                        {fuelAverage ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-emerald-400 font-mono">{fuelAverage} km/L</span>
                            <span className="text-[9px] text-slate-500">Based on previous odometer</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Initial baseline fill</span>
                        )}
                      </td>

                      {/* Pump Station name */}
                      <td className="py-4 px-4 text-xs text-slate-400 truncate max-w-[150px]" title={entry.pumpName}>
                        {entry.pumpName}
                      </td>

                      {/* Slips Printing & Action row */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewInvoice('fuel', entry)}
                            title="Print Fuel Receipt Slip"
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
                              if (window.confirm('Delete this fuel log? This will impact subsequent average calculations.')) {
                                onDeleteFuelEntry(entry.id);
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
                {editingEntry ? 'Edit Fuel Receipt Log' : 'Add New Fuel Receipt Log'}
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Pump Station Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Fuel Pump Station</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shell Jail Road, LHR"
                    value={pumpName}
                    onChange={(e) => setPumpName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Selector */}
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

                {/* Driver Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Designated Driver *</label>
                  <select
                    required
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Litres */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Litres Vol *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    placeholder="e.g. 45"
                    value={litres}
                    onChange={(e) => setLitres(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>

                {/* Rate Per Litre */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Rate per Litre (PKR) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    placeholder="e.g. 272"
                    value={ratePerLitre}
                    onChange={(e) => setRatePerLitre(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Odometer Reading */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Odometer (km) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 45850"
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>

                {/* Live calculated total amount */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Computed Amount (PKR)</label>
                  <div className="w-full px-3 py-2 bg-slate-950 rounded-lg text-sm font-bold text-emerald-400 border border-slate-850 flex items-center h-9 font-mono">
                    PKR {totalAmount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Auto computed: Litres × Rate</span>
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
                  {editingEntry ? 'Update Receipt' : 'Save Fuel Log'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
