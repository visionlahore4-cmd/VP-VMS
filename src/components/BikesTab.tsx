import React, { useState } from 'react';
import { Vehicle, Driver, Allotment } from '../types';
import { Plus, Search, Edit2, Trash2, Shield, Settings, Info, X, Bike, AlertCircle, CheckCircle } from 'lucide-react';

interface BikesTabProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  allotments: Allotment[];
  onAddBike: (bike: Omit<Vehicle, 'id'>) => void;
  onEditBike: (bike: Vehicle) => void;
  onDeleteBike: (id: string) => void;
}

export const BikesTab: React.FC<BikesTabProps> = ({
  vehicles,
  drivers,
  allotments,
  onAddBike,
  onEditBike,
  onDeleteBike
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Vehicle | null>(null);

  // Form states
  const [vehicleNo, setVehicleNo] = useState('');
  const [modelName, setModelName] = useState('');
  const [engineCC, setEngineCC] = useState('70 CC');
  const [color, setColor] = useState('Red');
  const [chassisNo, setChassisNo] = useState('');
  const [engineNo, setEngineNo] = useState('');
  const [insuranceStatus, setInsuranceStatus] = useState<Vehicle['insuranceStatus']>('Active');

  const openAddModal = () => {
    setEditingBike(null);
    setVehicleNo('');
    setModelName('Honda CD 70');
    setEngineCC('70 CC');
    setColor('Red');
    setChassisNo('');
    setEngineNo('');
    setInsuranceStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (bike: Vehicle) => {
    setEditingBike(bike);
    setVehicleNo(bike.vehicleNo);
    setModelName(bike.modelName);
    setEngineCC(bike.engineCC);
    setColor(bike.color);
    setChassisNo(bike.chassisNo);
    setEngineNo(bike.engineNo);
    setInsuranceStatus(bike.insuranceStatus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim() || !modelName.trim()) return;

    const data = {
      vehicleNo: vehicleNo.trim().toUpperCase(),
      modelName: modelName.trim(),
      vehicleType: 'Motorcycle' as const,
      engineCC: engineCC.trim() || '70 CC',
      color: color.trim() || 'Red',
      chassisNo: chassisNo.trim().toUpperCase() || 'N/A',
      engineNo: engineNo.trim().toUpperCase() || 'N/A',
      insuranceStatus
    };

    if (editingBike) {
      onEditBike({ ...data, id: editingBike.id });
    } else {
      onAddBike(data);
    }
    setIsModalOpen(false);
  };

  // Only show motorcycles
  const allBikes = vehicles.filter(v => v.vehicleType === 'Motorcycle');

  // Filter by Search
  const filteredBikes = allBikes.filter(v => {
    return (
      v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.chassisNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate statistics
  const totalBikesCount = allBikes.length;
  
  // Find allotted rider details for each bike
  const getBikeAllotment = (bikeId: string) => {
    const allotment = allotments.find(a => a.vehicleId === bikeId);
    if (!allotment) return null;
    const rider = drivers.find(d => d.id === allotment.driverId);
    return {
      riderName: rider ? rider.name : 'Unknown Rider',
      department: allotment.department,
      date: allotment.allotmentDate
    };
  };

  const allottedBikesCount = allBikes.filter(b => allotments.some(a => a.vehicleId === b.id)).length;
  const unallottedBikesCount = totalBikesCount - allottedBikesCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Bike className="w-6 h-6 text-emerald-400" /> Company Motorcycle Fleet
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register and monitor localized two-wheeler delivery riders, specifications, and field allotments.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Motorcycle
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Bikes Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Motorcycles</span>
            <span className="text-2xl font-extrabold text-slate-100 block mt-1">{totalBikesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Bike className="w-6 h-6" />
          </div>
        </div>

        {/* Allotted Riders Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Allotted to Riders</span>
            <span className="text-2xl font-extrabold text-orange-400 block mt-1">{allottedBikesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Available Pool Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Available in Pool</span>
            <span className="text-2xl font-extrabold text-teal-400 block mt-1">{unallottedBikesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Info className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Motorcycle Plate No or Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800/80 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder-slate-500"
          />
        </div>
      </div>

      {/* Grid of Motorcycle Cards */}
      {filteredBikes.length === 0 ? (
        <div className="p-16 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/20 text-center">
          <Bike className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="font-semibold text-slate-300">No Motorcycles Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by clicking 'Add Motorcycle' to register your company's two-wheeler vehicles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => {
            const riderInfo = getBikeAllotment(bike.id);
            return (
              <div 
                key={bike.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-700/60 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top Header */}
                <div className="p-5 border-b border-slate-900/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex flex-col bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">Pakistan</span>
                      <span className="text-emerald-400 font-bold text-xs tracking-wider text-center">{bike.vehicleNo}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${
                        bike.insuranceStatus === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : bike.insuranceStatus === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {bike.insuranceStatus}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-sm mt-1">{bike.modelName}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] border border-slate-800 text-slate-300 font-mono">
                      {bike.engineCC}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] border border-slate-800 text-slate-300">
                      Color: {bike.color}
                    </span>
                  </p>
                </div>

                {/* Specs list */}
                <div className="p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-900/40 pb-1.5">
                    <span className="text-slate-500">Chassis No:</span>
                    <span className="font-mono text-slate-300 font-semibold">{bike.chassisNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/40 pb-1.5">
                    <span className="text-slate-500">Engine No:</span>
                    <span className="font-mono text-slate-300 font-semibold">{bike.engineNo}</span>
                  </div>

                  {/* Rider Allotment Row */}
                  <div className="mt-4 pt-3 border-t border-slate-900/60">
                    {riderInfo ? (
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Assigned Rider</span>
                          <span className="font-semibold text-slate-200 mt-0.5 block">{riderInfo.riderName}</span>
                          <span className="text-[10px] text-emerald-400 font-medium block">{riderInfo.department} Department</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[9px] font-bold border border-orange-500/20 uppercase">
                          Allotted
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
                        <span className="text-slate-500 block text-xs">Unassigned Pool Bike</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">Available for instant rider allotment</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons footer */}
                <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-900/80 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide">Ref. ID: {bike.id}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(bike)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-colors"
                      title="Edit Specifications"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete motorcycle ${bike.vehicleNo}?`)) {
                          onDeleteBike(bike.id);
                        }
                      }}
                      className="p-2 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/10 hover:border-rose-500/20 cursor-pointer transition-colors"
                      title="Remove from Fleet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Motorcycle Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800/80 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Title */}
            <div className="p-6 border-b border-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-100">
                  {editingBike ? 'Edit Motorcycle Spec' : 'Add New Motorcycle'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Input registration data and technical metrics.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Plate Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Motorcycle Plate No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LHO-26-4412"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Model Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honda CD 70"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Engine CC */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Engine Power (CC)</label>
                  <select
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  >
                    <option value="70 CC">70 CC</option>
                    <option value="100 CC">100 CC</option>
                    <option value="110 CC">110 CC</option>
                    <option value="125 CC">125 CC</option>
                    <option value="150 CC">150 CC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Red"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Insurance Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Insurance Status</label>
                  <select
                    value={insuranceStatus}
                    onChange={(e) => setInsuranceStatus(e.target.value as Vehicle['insuranceStatus'])}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  >
                    <option value="Active">Active / Valid</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Chassis Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Chassis Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CD70-8812733"
                    value={chassisNo}
                    onChange={(e) => setChassisNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Engine Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Engine Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CD70E-481921"
                    value={engineNo}
                    onChange={(e) => setEngineNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              {/* Submit footer */}
              <div className="pt-4 border-t border-slate-900 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  {editingBike ? 'Save Changes' : 'Add Motorcycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
