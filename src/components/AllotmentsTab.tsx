import React, { useState } from 'react';
import { Allotment, Vehicle, Driver } from '../types';
import { Plus, Search, Edit2, Trash2, Key, Landmark, Calendar, Info, X } from 'lucide-react';

interface AllotmentsTabProps {
  allotments: Allotment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddAllotment: (allotment: Omit<Allotment, 'id'>) => void;
  onEditAllotment: (allotment: Allotment) => void;
  onDeleteAllotment: (id: string) => void;
}

export const AllotmentsTab: React.FC<AllotmentsTabProps> = ({
  allotments,
  vehicles,
  drivers,
  onAddAllotment,
  onEditAllotment,
  onDeleteAllotment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllotment, setEditingAllotment] = useState<Allotment | null>(null);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [department, setDepartment] = useState<Allotment['department']>('General');
  const [allotmentDate, setAllotmentDate] = useState('');

  const openAddModal = () => {
    setEditingAllotment(null);
    // Find first unassigned vehicle or default to first overall
    const assignedVehicleIds = allotments.map(a => a.vehicleId);
    const unassignedVehicles = vehicles.filter(v => !assignedVehicleIds.includes(v.id));
    setVehicleId(unassignedVehicles[0]?.id || vehicles[0]?.id || '');

    // Find first unassigned driver or default to first overall
    const assignedDriverIds = allotments.map(a => a.driverId);
    const unassignedDrivers = drivers.filter(d => !assignedDriverIds.includes(d.id));
    setDriverId(unassignedDrivers[0]?.id || drivers[0]?.id || '');

    setDepartment('General');
    // Set current date in YYYY-MM-DD
    setAllotmentDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (allotment: Allotment) => {
    setEditingAllotment(allotment);
    setVehicleId(allotment.vehicleId);
    setDriverId(allotment.driverId);
    setDepartment(allotment.department);
    setAllotmentDate(allotment.allotmentDate);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !driverId || !allotmentDate) return;

    // Check if vehicle is already allotted elsewhere (excluding current editing allotment)
    const isVehicleTaken = allotments.some(
      a => a.vehicleId === vehicleId && (!editingAllotment || a.id !== editingAllotment.id)
    );
    if (isVehicleTaken) {
      alert('Error: This vehicle is already allotted to another active department. Please choose another vehicle or remove the previous allotment first.');
      return;
    }

    const data = {
      vehicleId,
      driverId,
      department,
      allotmentDate
    };

    if (editingAllotment) {
      onEditAllotment({ ...data, id: editingAllotment.id });
    } else {
      onAddAllotment(data);
    }
    setIsModalOpen(false);
  };

  // Lists of available vehicles/drivers for dropdowns in form, taking into account current assignments
  const activeAllotmentIds = allotments.map(a => a.vehicleId);
  const availableVehicles = vehicles.filter(
    v => !activeAllotmentIds.includes(v.id) || (editingAllotment && v.id === editingAllotment.vehicleId)
  );

  const activeDriverIds = allotments.map(a => a.driverId);
  const availableDrivers = drivers.filter(
    d => !activeDriverIds.includes(d.id) || (editingAllotment && d.id === editingAllotment.driverId)
  );

  // Filter allotments by search & department
  const filteredAllotments = allotments.filter(alt => {
    const vehicle = vehicles.find(v => v.id === alt.vehicleId);
    const driver = drivers.find(d => d.id === alt.driverId);

    const matchText = 
      (vehicle?.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle?.modelName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      alt.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = selectedDept === 'All' || alt.department === selectedDept;

    return matchText && matchDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Key className="w-6 h-6 text-emerald-400" /> Department Vehicle Allotments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Allocate transport units to corporate departments and designate primary operational drivers.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Allotment
        </button>
      </div>

      {/* Control filter bar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search allotments by Plate, Vehicle Model, Driver Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800/80 focus:border-emerald-500/50 outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80 self-start md:self-auto">
          <Landmark className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:ring-0 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="General">General</option>
            <option value="SCM">SCM</option>
            <option value="Accounts">Accounts</option>
            <option value="Sale">Sale</option>
            <option value="Admin">Admin</option>
            <option value="Production">Production</option>
          </select>
        </div>
      </div>

      {/* Table list of allotments */}
      <div className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
        {filteredAllotments.length === 0 ? (
          <div className="py-16 text-center">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No active allotments registered.</p>
            <p className="text-xs text-slate-500 mt-1">Issue a new allotment to connect vehicles and drivers to departments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Department Unit</th>
                  <th className="py-3.5 px-4">Allotted Transit</th>
                  <th className="py-3.5 px-4">Designated Driver</th>
                  <th className="py-3.5 px-4">License Verification</th>
                  <th className="py-3.5 px-4">Allotment Issued</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredAllotments.map((alt) => {
                  const vehicle = vehicles.find(v => v.id === alt.vehicleId);
                  const driver = drivers.find(d => d.id === alt.driverId);

                  return (
                    <tr key={alt.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Department Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                          <span className="font-bold text-slate-100">{alt.department}</span>
                        </div>
                      </td>

                      {/* Vehicle Unit info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="inline-flex bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-mono text-xs text-emerald-400">
                            {vehicle?.vehicleNo || 'Deleted Vehicle'}
                          </div>
                          <div className="flex flex-col text-xs">
                            <span className="text-slate-300">{vehicle?.modelName || 'Unknown Model'}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{vehicle?.vehicleType}</span>
                          </div>
                        </div>
                      </td>

                      {/* Designated Driver */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200 flex items-center gap-1.5 flex-wrap">
                            {driver?.name || 'Deleted Driver'}
                            {driver?.isSelfDrive && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20">
                                Self Drive
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500">{driver?.phone || 'No Contact'}</span>
                        </div>
                      </td>

                      {/* License number check */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">
                        {driver?.licenseNo || 'N/A'}
                      </td>

                      {/* Allotment Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-mono">{alt.allotmentDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(alt)}
                            title="Edit Allotment"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to revoke this department vehicle allotment?')) {
                                onDeleteAllotment(alt.id);
                              }
                            }}
                            title="Revoke Allotment"
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

      {/* Centered Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                {editingAllotment ? 'Edit Allotment Order' : 'Issue New Department Allotment'}
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
              
              {/* Department Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Department Unit *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Allotment['department'])}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="SCM">SCM</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Sale">Sale</option>
                  <option value="Admin">Admin</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              {/* Vehicle Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Choose Vehicle *</label>
                {availableVehicles.length === 0 ? (
                  <div className="text-xs text-orange-400 p-2 bg-orange-500/15 border border-orange-500/20 rounded-lg">
                    No vehicles available. All vehicles in the fleet are currently allotted. Go to the Vehicles database to add more, or revoke an allotment first.
                  </div>
                ) : (
                  <select
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                  >
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNo} — {v.modelName} ({v.vehicleType})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Driver Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Designate Driver *</label>
                {availableDrivers.length === 0 ? (
                  <div className="text-xs text-orange-400 p-2 bg-orange-500/15 border border-orange-500/20 rounded-lg">
                    No drivers available. All registered drivers are currently on active allotments. Go to Drivers roster to add more.
                  </div>
                ) : (
                  <select
                    required
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none cursor-pointer"
                  >
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} — License: {d.licenseNo} ({d.assignedDepartment} Dept)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Allotment Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Allotment Date *</label>
                <input
                  type="date"
                  required
                  value={allotmentDate}
                  onChange={(e) => setAllotmentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                />
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
                  disabled={availableVehicles.length === 0 || availableDrivers.length === 0}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all glow-emerald cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingAllotment ? 'Update Allotment' : 'Assign Allotment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
