import React, { useState } from 'react';
import { Vehicle, Driver } from '../types';
import { Plus, Search, Edit2, Trash2, Shield, Settings, Info, X } from 'lucide-react';

interface VehiclesTabProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  allotments: { vehicleId: string; department: string }[];
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({
  vehicles,
  drivers,
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

  // Screenshot 1 additional states
  const [modelYear, setModelYear] = useState('');
  const [department, setDepartment] = useState<'General' | 'SCM' | 'Accounts' | 'Sale' | 'Admin' | 'Production' | ''>('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Maintenance' | 'Sold'>('Active');
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [designation, setDesignation] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [allotmentDate, setAllotmentDate] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [sundarETag, setSundarETag] = useState(false);
  const [environmentalTag, setEnvironmentalTag] = useState(false);

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

    // Reset screenshot 1 additional fields
    setModelYear('');
    setDepartment('');
    setStatus('Active');
    setAssignedDriverId('');
    setDesignation('');
    setEmployeeId('');
    setAllotmentDate('');
    setInsuranceExpiryDate('');
    setSundarETag(false);
    setEnvironmentalTag(false);

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

    // Populate screenshot 1 additional fields
    setModelYear(vehicle.modelYear || '');
    setDepartment(vehicle.department || '');
    setStatus(vehicle.status || 'Active');
    setAssignedDriverId(vehicle.assignedDriverId || '');
    setDesignation(vehicle.designation || '');
    setEmployeeId(vehicle.employeeId || '');
    setAllotmentDate(vehicle.allotmentDate || '');
    setInsuranceExpiryDate(vehicle.insuranceExpiryDate || '');
    setSundarETag(!!vehicle.sundarETag);
    setEnvironmentalTag(!!vehicle.environmentalTag);

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
      insuranceStatus,

      // Screenshot 1 additional data fields
      modelYear: modelYear.trim(),
      department: department || '',
      status,
      assignedDriverId,
      designation: designation.trim(),
      employeeId: employeeId.trim(),
      allotmentDate,
      insuranceExpiryDate,
      sundarETag,
      environmentalTag
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 bg-[#161a33]/95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#121528]/80">
              <h3 className="font-display font-bold text-slate-100 text-lg">
                {editingVehicle ? `Vehicle Specification - ${editingVehicle.vehicleNo}` : 'Add New Vehicle Unit'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Row 1: Registration No & Model Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Registration No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ARX-361"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Model Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024"
                    value={modelYear}
                    onChange={(e) => setModelYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Row 2: Model Name & Make/Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Grande"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Make & Type *</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as Vehicle['vehicleType'])}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Color & Power */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. White"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Power (CC)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1800cc"
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Row 4: Department & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Department *</label>
                  <select
                    value={department}
                    required
                    onChange={(e) => setDepartment(e.target.value as Vehicle['department'])}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    <option value="General">General</option>
                    <option value="SCM">SCM</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Sale">Sale</option>
                    <option value="Admin">Admin</option>
                    <option value="Production">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Chassis No & Engine No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Chassis No</label>
                  <input
                    type="text"
                    placeholder="e.g. JT2AE09W1D3012345"
                    value={chassisNo}
                    onChange={(e) => setChassisNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all font-mono placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Engine No</label>
                  <input
                    type="text"
                    placeholder="e.g. 2NZ-1234567"
                    value={engineNo}
                    onChange={(e) => setEngineNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all font-mono placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Row 6: Assigned Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assigned Name</label>
                  <select
                    value={assignedDriverId}
                    onChange={(e) => setAssignedDriverId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="">— Unassigned —</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. GM, Manager, Executive"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Row 7: Employee ID & Allotment Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-101"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Allotment Date</label>
                  <input
                    type="date"
                    value={allotmentDate}
                    onChange={(e) => setAllotmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 8: Insurance Status & Insurance Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Insurance Status</label>
                  <select
                    value={insuranceStatus}
                    onChange={(e) => setInsuranceStatus(e.target.value as Vehicle['insuranceStatus'])}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Insured">Not Insured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Insurance Expiry Date</label>
                  <input
                    type="date"
                    value={insuranceExpiryDate}
                    onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1f38] text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 9: Token & Tags Section Header */}
              <div className="pt-2 border-t border-slate-800/50">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">TOKEN & TAGS</h4>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Sundar E-Tag Checkbox */}
                  <label className="inline-flex items-center gap-3 text-xs text-slate-300 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sundarETag}
                      onChange={(e) => setSundarETag(e.target.checked)}
                      className="w-4.5 h-4.5 bg-[#1a1f38] border border-slate-800 rounded focus:ring-0 text-indigo-600 accent-indigo-500 cursor-pointer"
                    />
                    SUNDAR E-TAG / TOKEN RENEWED
                  </label>

                  {/* Environmental Tag Checkbox */}
                  <label className="inline-flex items-center gap-3 text-xs text-slate-300 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={environmentalTag}
                      onChange={(e) => setEnvironmentalTag(e.target.checked)}
                      className="w-4.5 h-4.5 bg-[#1a1f38] border border-slate-800 rounded focus:ring-0 text-indigo-600 accent-indigo-500 cursor-pointer"
                    />
                    ENVIRONMENTAL TAG
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-[#6366f1] hover:bg-[#5053e1] text-white rounded-xl transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer"
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
