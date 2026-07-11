import React, { useState, useEffect } from 'react';
import { FuelEntry, Vehicle, Driver, Allotment } from '../types';
import { Plus, Search, Edit2, Trash2, Fuel, Calendar, Gauge, CreditCard, Droplet, Printer, Info, X, AlertCircle } from 'lucide-react';

interface FuelTabProps {
  fuelEntries: FuelEntry[];
  vehicles: Vehicle[];
  drivers: Driver[];
  allotments: Allotment[];
  onAddFuelEntry: (entry: Omit<FuelEntry, 'id'>) => void;
  onAddFuelEntries?: (entries: Omit<FuelEntry, 'id'>[]) => void;
  onEditFuelEntry: (entry: FuelEntry) => void;
  onDeleteFuelEntry: (id: string) => void;
  onViewInvoice: (type: 'fuel' | 'maintenance', item: any) => void;
}

interface FuelFormRow {
  vehicleId: string;
  driverId: string;
  fuelType: 'PETROL' | 'DIESEL';
  date: string;
  litres: number | '';
  ratePerLitre: number | '';
  odometerReading: number | '';
  pumpName: string;
}

export const FuelTab: React.FC<FuelTabProps> = ({
  fuelEntries,
  vehicles,
  drivers,
  allotments,
  onAddFuelEntry,
  onAddFuelEntries,
  onEditFuelEntry,
  onDeleteFuelEntry,
  onViewInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FuelEntry | null>(null);

  // Top filters inside Multi-add modal
  const [modalDeptFilter, setModalDeptFilter] = useState<string>('All');
  const [modalSearchTerm, setModalSearchTerm] = useState<string>('');

  // Multi-row form states
  const [rows, setRows] = useState<FuelFormRow[]>([]);

  // Unique departments for filter inside the modal
  const uniqueDepartments = Array.from(new Set(allotments.map(a => a.department))).filter(Boolean);

  // Only show company employed drivers as per user instructions
  const companyDrivers = drivers.filter(d => !d.isSelfDrive);

  const createEmptyRow = (): FuelFormRow => ({
    vehicleId: '',
    driverId: '',
    fuelType: 'PETROL',
    date: new Date().toISOString().split('T')[0],
    litres: '',
    ratePerLitre: 272, // Realistic baseline Fuel Rate
    odometerReading: '',
    pumpName: 'Shell Jail Road, LHR'
  });

  const openAddModal = () => {
    setEditingEntry(null);
    setModalDeptFilter('All');
    setModalSearchTerm('');
    // Prefill with 6 vehicles rows
    setRows([
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow(),
      createEmptyRow()
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: FuelEntry) => {
    setEditingEntry(entry);
    setModalDeptFilter('All');
    setModalSearchTerm('');
    
    // Auto-determine fuel type for the editing item
    const v = vehicles.find(veh => veh.id === entry.vehicleId);
    const calculatedFuelType = (v?.vehicleType === 'Truck' || v?.vehicleNo.toUpperCase().includes('DSL') || v?.modelName.toUpperCase().includes('DIESEL')) ? 'DIESEL' : 'PETROL';

    setRows([{
      vehicleId: entry.vehicleId,
      driverId: entry.driverId,
      fuelType: calculatedFuelType as 'PETROL' | 'DIESEL',
      date: entry.date,
      litres: entry.litres,
      ratePerLitre: entry.ratePerLitre,
      odometerReading: entry.odometerReading,
      pumpName: entry.pumpName
    }]);
    setIsModalOpen(true);
  };

  const handleAddRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== index));
  };

  const handleRowValueChange = (index: number, key: keyof FuelFormRow, val: any) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [key]: val
    };
    setRows(updated);
  };

  // Helper to auto-calculate the driver and fuel type when vehicle changes
  const handleVehicleChange = (index: number, val: string) => {
    const updated = [...rows];
    updated[index].vehicleId = val;

    const selectedVehicle = vehicles.find(v => v.id === val);
    if (selectedVehicle) {
      // Auto-assign fuel type
      if (selectedVehicle.vehicleType === 'Truck' || selectedVehicle.vehicleNo.toUpperCase().includes('DSL') || selectedVehicle.modelName.toUpperCase().includes('DIESEL')) {
        updated[index].fuelType = 'DIESEL';
      } else {
        updated[index].fuelType = 'PETROL';
      }

      // Auto-fill active allotted Company Driver
      const allotment = allotments.find(a => a.vehicleId === val);
      if (allotment) {
        const assignedDriver = companyDrivers.find(d => d.id === allotment.driverId);
        if (assignedDriver) {
          updated[index].driverId = assignedDriver.id;
        } else {
          updated[index].driverId = '';
        }
      } else {
        updated[index].driverId = '';
      }
    } else {
      updated[index].driverId = '';
    }

    setRows(updated);
  };

  // Dynamic dropdown list filtering inside each cell of vehicle selector
  const getVehiclesForDropdown = (currentRowVehId: string) => {
    return vehicles.filter(v => {
      // Always retain selected one to avoid blank items
      if (v.id === currentRowVehId) return true;

      const matchesSearch = modalSearchTerm === '' ||
        v.vehicleNo.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        v.modelName.toLowerCase().includes(modalSearchTerm.toLowerCase());

      if (modalDeptFilter !== 'All') {
        const alt = allotments.find(a => a.vehicleId === v.id);
        return matchesSearch && alt?.department === modalDeptFilter;
      }

      return matchesSearch;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check entered rows
    const activeRows = rows.filter(r => r.vehicleId !== '');
    if (activeRows.length === 0) {
      alert('Please select at least one vehicle to log fuel receipts.');
      return;
    }

    // Validate active rows have complete metadata
    const incompleteRow = activeRows.find(r => !r.driverId || !r.date || r.litres === '' || r.ratePerLitre === '' || r.odometerReading === '');
    if (incompleteRow) {
      alert('Please complete all fields (Driver, Litres, Rate, Odometer) for the chosen vehicles.');
      return;
    }

    // Process & submit entries
    const entries = activeRows.map(r => {
      const calculatedTotal = Math.round(Number(r.litres) * Number(r.ratePerLitre));
      return {
        date: r.date,
        vehicleId: r.vehicleId,
        driverId: r.driverId,
        litres: Number(r.litres),
        ratePerLitre: Number(r.ratePerLitre),
        totalAmount: calculatedTotal,
        odometerReading: Number(r.odometerReading),
        pumpName: r.pumpName.trim() || 'Shell Jail Road, LHR'
      };
    });

    if (editingEntry) {
      onEditFuelEntry({ ...entries[0], id: editingEntry.id });
    } else {
      if (onAddFuelEntries) {
        onAddFuelEntries(entries);
      } else {
        entries.forEach(entry => onAddFuelEntry(entry));
      }
    }

    setIsModalOpen(false);
  };

  // Fuel Average calculation for list
  const getFuelAverageForEntry = (entry: FuelEntry) => {
    const vLogs = fuelEntries
      .filter(f => f.vehicleId === entry.vehicleId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.odometerReading - b.odometerReading);

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

  // Previous odometer helper for active modal avg calculations
  const getPreviousOdometer = (vehId: string) => {
    if (!vehId) return null;
    const vLogs = fuelEntries
      .filter(f => f.vehicleId === vehId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.odometerReading - a.odometerReading);
    return vLogs.length > 0 ? vLogs[vLogs.length - 1].odometerReading : null;
  };

  // General Filter on primary list
  const filteredFuelEntries = fuelEntries.filter(entry => {
    const vehicle = vehicles.find(v => v.id === entry.vehicleId);
    const driver = drivers.find(d => d.id === entry.driverId);

    const matchText =
      (vehicle?.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pumpName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVehicle = selectedVehicleId === 'All' || entry.vehicleId === selectedVehicleId;

    return matchText && matchVehicle;
  }).sort((a, b) => b.date.localeCompare(a.date));

  // Compute live grand total in modal
  const modalGrandTotal = rows.reduce((sum, r) => {
    if (!r.vehicleId) return sum;
    return sum + Math.round((Number(r.litres) || 0) * (Number(r.ratePerLitre) || 0));
  }, 0);

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

      {/* Add / Edit Centered Multi-Row Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print overflow-y-auto">
          <div className="w-full max-w-7xl rounded-2xl glass-panel border border-slate-800/80 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <div>
                <h3 className="font-display font-bold text-slate-100 text-lg">
                  {editingEntry ? 'Edit Fuel Receipt' : 'Add Fuel Entries'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {editingEntry ? 'Update your selected fuel transaction receipt.' : 'Direct data input grid: batch record fuel receipts for up to 6+ vehicles at once.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-850 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal filters toolbar (Matches screenshot) */}
            {!editingEntry && (
              <div className="p-4 bg-slate-950/40 border-b border-slate-900/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">FILTER BY DEPARTMENT</label>
                  <select
                    value={modalDeptFilter}
                    onChange={(e) => setModalDeptFilter(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Departments</option>
                    {uniqueDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Search Vehicle Input */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">SEARCH VEHICLE</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search vehicle name or plate..."
                      value={modalSearchTerm}
                      onChange={(e) => setModalSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal Form Container */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Add row controller */}
              {!editingEntry && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Vehicle Row
                  </button>
                </div>
              )}

              {/* Data entry grid with scrollable area */}
              <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/20 max-h-[380px] scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[1250px]">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800/80 sticky top-0 z-10">
                      <th className="py-3 px-3 w-[200px]">Vehicle</th>
                      <th className="py-3 px-3 w-[180px]">Driver</th>
                      <th className="py-3 px-3 w-[110px]">Fuel</th>
                      <th className="py-3 px-3 w-[140px]">Date</th>
                      <th className="py-3 px-3 w-[100px]">Litres</th>
                      <th className="py-3 px-3 w-[110px]">Rate/L (PKR)</th>
                      <th className="py-3 px-3 w-[120px]">Total (PKR)</th>
                      <th className="py-3 px-3 w-[120px]">Odometer (km)</th>
                      <th className="py-3 px-3 w-[100px] text-center text-emerald-400">Avg (km/L)</th>
                      <th className="py-3 px-3 w-[180px]">⛽ Pump Station</th>
                      <th className="py-3 px-2 w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {rows.map((row, index) => {
                      const rowTotal = Math.round((Number(row.litres) || 0) * (Number(row.ratePerLitre) || 0));
                      const prevOdo = getPreviousOdometer(row.vehicleId);
                      let calculatedAvg = null;
                      if (prevOdo !== null && row.odometerReading && row.litres) {
                        const diff = Number(row.odometerReading) - prevOdo;
                        if (diff > 0) {
                          calculatedAvg = (diff / Number(row.litres)).toFixed(1);
                        }
                      }

                      return (
                        <tr key={index} className="hover:bg-slate-900/10 transition-colors">
                          {/* Vehicle Selector */}
                          <td className="p-2">
                            <select
                              required={row.driverId !== '' || row.litres !== '' || row.odometerReading !== ''}
                              value={row.vehicleId}
                              onChange={(e) => handleVehicleChange(index, e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none cursor-pointer"
                            >
                              <option value="">Select Vehicle</option>
                              {getVehiclesForDropdown(row.vehicleId).map(v => (
                                <option key={v.id} value={v.id}>
                                  {v.vehicleNo} ({v.modelName})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Driver Selector - SHOW ONLY company drivers */}
                          <td className="p-2">
                            <select
                              required={row.vehicleId !== ''}
                              value={row.driverId}
                              onChange={(e) => handleRowValueChange(index, 'driverId', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none cursor-pointer"
                            >
                              <option value="">Select Driver</option>
                              {companyDrivers.map(d => (
                                <option key={d.id} value={d.id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Fuel Type */}
                          <td className="p-2">
                            <select
                              value={row.fuelType}
                              onChange={(e) => handleRowValueChange(index, 'fuelType', e.target.value as 'PETROL' | 'DIESEL')}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none cursor-pointer"
                            >
                              <option value="PETROL">PETROL</option>
                              <option value="DIESEL">DIESEL</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="p-2">
                            <input
                              type="date"
                              required={row.vehicleId !== ''}
                              value={row.date}
                              onChange={(e) => handleRowValueChange(index, 'date', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none"
                            />
                          </td>

                          {/* Litres Volume */}
                          <td className="p-2">
                            <input
                              type="number"
                              step="any"
                              min="0.01"
                              placeholder="0.00"
                              required={row.vehicleId !== ''}
                              value={row.litres}
                              onChange={(e) => handleRowValueChange(index, 'litres', e.target.value !== '' ? Number(e.target.value) : '')}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none font-mono"
                            />
                          </td>

                          {/* Rate Per Litre */}
                          <td className="p-2">
                            <input
                              type="number"
                              step="any"
                              min="0.1"
                              placeholder="0.00"
                              required={row.vehicleId !== ''}
                              value={row.ratePerLitre}
                              onChange={(e) => handleRowValueChange(index, 'ratePerLitre', e.target.value !== '' ? Number(e.target.value) : '')}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none font-mono"
                            />
                          </td>

                          {/* Total Cost Display (Calculated) */}
                          <td className="p-2">
                            <div className="w-full px-2 py-1.5 bg-slate-950/60 rounded-lg text-xs font-bold text-slate-400 border border-slate-900 font-mono">
                              PKR {rowTotal.toLocaleString()}
                            </div>
                          </td>

                          {/* Odometer Log */}
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              placeholder="km"
                              required={row.vehicleId !== ''}
                              value={row.odometerReading}
                              onChange={(e) => handleRowValueChange(index, 'odometerReading', e.target.value !== '' ? Number(e.target.value) : '')}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none font-mono"
                            />
                          </td>

                          {/* Dynamic Average Fuel usage */}
                          <td className="p-2 text-center">
                            {calculatedAvg ? (
                              <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{calculatedAvg} km/L</span>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">—</span>
                            )}
                          </td>

                          {/* Pump Station */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="e.g. PSO Jail Road"
                              value={row.pumpName}
                              onChange={(e) => handleRowValueChange(index, 'pumpName', e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800/80 focus:border-indigo-500 outline-none"
                            />
                          </td>

                          {/* Delete Action button */}
                          <td className="p-2 text-center">
                            {!editingEntry && rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(index)}
                                className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grand Total Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <AlertCircle className="w-4 h-4 text-slate-500" />
                  <span>Only filled rows with valid vehicle selections will be registered.</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Grand Total:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">PKR {modalGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Modal controls actions footer */}
              <div className="pt-4 border-t border-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-indigo-600/20 transition-all font-sans active:scale-95"
                >
                  {editingEntry ? 'Update Entry' : 'Save All Entries'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
