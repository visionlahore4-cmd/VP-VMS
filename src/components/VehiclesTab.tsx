import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Plus, Search, Edit2, Trash2, Shield, Settings, Info, X } from 'lucide-react';

interface VehiclesTabProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  allotments: { vehicleId: string; department: string }[];
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  allotments
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [vehicleNo, setVehicleNo] = useState('');
  const [modelName, setModelName] = useState('');
  const [vehicleType, setVehicleType] = useState<Vehicle['vehicleType']>('Car');
  const [engineCC, setEngineCC] = useState('');
  const [color, setColor] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [engineNo, setEngineNo] = useState('');
  const [insuranceStatus, setInsuranceStatus] = useState<Vehicle['insuranceStatus']>('Active');

  const openAddModal = () => {
    setEditingVehicle(null);
    setVehicleNo('');
    setModelName('');
    setVehicleType('Car');
    setEngineCC('');
    setColor('');
    setChassisNo('');
    setEngineNo('');
    setInsuranceStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleNo(vehicle.vehicleNo);
    setModelName(vehicle.modelName);
    setVehicleType(vehicle.vehicleType);
    setEngineCC(vehicle.engineCC);
    setColor(vehicle.color);
    setChassisNo(vehicle.chassisNo);
    setEngineNo(vehicle.engineNo);
    setInsuranceStatus(vehicle.insuranceStatus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim() || !modelName.trim()) return;

    const data = {
      vehicleNo: vehicleNo.trim().toUpperCase(),
      modelName: modelName.trim(),
      vehicleType,
      engineCC: engineCC.trim() || 'N/A',
      color: color.trim() || 'N/A',
      chassisNo: chassisNo.trim().toUpperCase() || 'N/A',
      engineNo: engineNo.trim().toUpperCase() || 'N/A',
      insuranceStatus
    };

    if (editingVehicle) {
      onEditVehicle({ ...data, id: editingVehicle.id });
    } else {
      onAddVehicle(data);
    }
    setIsModalOpen(false);
  };

  // Filter & Search Logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.chassisNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || v.vehicleType === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" /> Vehicle Database Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register and monitor specifications, regulatory documentation, and insurance status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Plate, Model Name, or Chassis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800/80 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder-slate-500"
          />
        </div>

        {/* Type selector tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
          {['All', 'Car', 'Motorcycle', 'Van', 'Truck'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                selectedType === type
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards or Table depending on density */}
      <div className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
        {filteredVehicles.length === 0 ? (
          <div className="py-16 text-center">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No vehicles match your search criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try refining your filter or add a new vehicle unit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 pl-6">Plate (Reg No)</th>
                  <th className="py-3.5 px-4">Type & Model</th>
                  <th className="py-3.5 px-4">Engine CC / Color</th>
                  <th className="py-3.5 px-4">Chassis / Engine Code</th>
                  <th className="py-3.5 px-4">Allotment</th>
                  <th className="py-3.5 px-4">Insurance</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredVehicles.map((vehicle) => {
                  const matchingAllotment = allotments.find(a => a.vehicleId === vehicle.id);
                  const isInsuranceActive = vehicle.insuranceStatus === 'Active';
                  const isInsuranceExpired = vehicle.insuranceStatus === 'Expired';

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Register Number plate */}
                      <td className="py-4 px-4 pl-6">
                        <div className="inline-flex flex-col bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center border-b border-slate-800 pb-0.5 mb-0.5">Pakistan</span>
                          <span className="text-emerald-400 font-bold text-xs tracking-wider text-center">{vehicle.vehicleNo}</span>
                        </div>
                      </td>

                      {/* Brand Model name & specs */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{vehicle.modelName}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{vehicle.vehicleType}</span>
                        </div>
                      </td>

                      {/* Specs engineCC & color */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col text-xs text-slate-300">
                          <span>{vehicle.engineCC} CC</span>
                          <span className="text-[10px] text-slate-500">{vehicle.color}</span>
                        </div>
                      </td>

                      {/* Hardware Chassis & Engine code */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">
                        <div className="flex flex-col">
                          <span>C: {vehicle.chassisNo}</span>
                          <span>E: {vehicle.engineNo}</span>
                        </div>
                      </td>

                      {/* Active assignment department badge */}
                      <td className="py-4 px-4">
                        {matchingAllotment ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {matchingAllotment.department} Dept
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800/40 text-slate-400 border border-slate-800">
                            Pool Garage
                          </span>
                        )}
                      </td>

                      {/* Insurance status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Shield className={`w-3.5 h-3.5 ${
                            isInsuranceActive 
                              ? 'text-emerald-400' 
                              : isInsuranceExpired 
                                ? 'text-orange-500' 
                                : 'text-slate-400'
                          }`} />
                          <span className={`text-xs font-semibold ${
                            isInsuranceActive 
                              ? 'text-emerald-400' 
                              : isInsuranceExpired 
                                ? 'text-orange-400' 
                                : 'text-slate-400'
                          }`}>
                            {vehicle.insuranceStatus}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(vehicle)}
                            title="Edit Vehicle"
                            className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.vehicleNo}? This will remove associated assignments.`)) {
                                onDeleteVehicle(vehicle.id);
                              }
                            }}
                            title="Delete Vehicle"
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

      {/* Centered glassmorphic modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                {editingVehicle ? `Edit Vehicle: ${editingVehicle.vehicleNo}` : 'Add New Vehicle Unit'}
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
                {/* Vehicle Plate Reg No */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Vehicle Plate No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LEC-14-4921"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Vehicle Type */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as Vehicle['vehicleType'])}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand Model name */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Corolla Altis"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Engine CC */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Engine CC</label>
                  <input
                    type="text"
                    placeholder="e.g. 1600"
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Color */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Super White"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Insurance status */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Insurance Status</label>
                  <select
                    value={insuranceStatus}
                    onChange={(e) => setInsuranceStatus(e.target.value as Vehicle['insuranceStatus'])}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Chassis & Engine numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Chassis Number</label>
                  <input
                    type="text"
                    placeholder="Chassis Frame code"
                    value={chassisNo}
                    onChange={(e) => setChassisNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Engine Number</label>
                  <input
                    type="text"
                    placeholder="Engine Block code"
                    value={engineNo}
                    onChange={(e) => setEngineNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono"
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
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
