import React, { useState } from 'react';
import { Driver } from '../types';
import { Plus, Search, Edit2, Trash2, Users, Landmark, Phone, Calendar, Info, X } from 'lucide-react';

interface DriversTabProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
  allotments: { driverId: string; vehicleId: string }[];
  vehicles: { id: string; vehicleNo: string }[];
  isAdmin?: boolean;
}

export const DriversTab: React.FC<DriversTabProps> = ({
  drivers,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
  allotments,
  vehicles,
  isAdmin = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [driverTypeFilter, setDriverTypeFilter] = useState<'Company' | 'SelfDrive' | 'All'>('Company');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState<Driver['assignedDepartment']>('General');
  const [isSelfDrive, setIsSelfDrive] = useState(false);

  const openAddModal = () => {
    setEditingDriver(null);
    setName('');
    setPhone('');
    setLicenseNo('');
    setLicenseExpiryDate('');
    setAssignedDepartment('General');
    setIsSelfDrive(false);
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setPhone(driver.phone);
    setLicenseNo(driver.licenseNo);
    setLicenseExpiryDate(driver.licenseExpiryDate);
    setAssignedDepartment(driver.assignedDepartment);
    setIsSelfDrive(driver.isSelfDrive || false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isSelfDrive && (!phone.trim() || !licenseNo.trim() || !licenseExpiryDate.trim())) return;

    const data = {
      name: name.trim(),
      phone: phone.trim() || 'N/A',
      licenseNo: isSelfDrive ? (licenseNo.trim().toUpperCase() || 'SELF-DRIVE') : licenseNo.trim().toUpperCase(),
      licenseExpiryDate: isSelfDrive ? (licenseExpiryDate || '2099-12-31') : licenseExpiryDate,
      assignedDepartment,
      isSelfDrive
    };

    if (editingDriver) {
      onEditDriver({ ...data, id: editingDriver.id });
    } else {
      onAddDriver(data);
    }
    setIsModalOpen(false);
  };

  // Filter & Search Logic
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.licenseNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || d.assignedDepartment === selectedDept;
    
    const matchesType = 
      driverTypeFilter === 'All' ? true :
      driverTypeFilter === 'Company' ? !d.isSelfDrive :
      d.isSelfDrive;
    
    return matchesSearch && matchesDept && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Drivers Directory & Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain driver license details, compliance expiry dates, and department assignments.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all text-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        )}
      </div>

      {/* Driver Type Tabs */}
      <div className="flex border-b border-slate-800/80 gap-1 overflow-x-auto pb-1 sm:pb-0">
        <button
          onClick={() => setDriverTypeFilter('Company')}
          className={`px-5 py-2.5 font-display text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            driverTypeFilter === 'Company'
              ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Company Employed Drivers
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            driverTypeFilter === 'Company' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'
          }`}>
            {drivers.filter(d => !d.isSelfDrive).length}
          </span>
        </button>
        <button
          onClick={() => setDriverTypeFilter('SelfDrive')}
          className={`px-5 py-2.5 font-display text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            driverTypeFilter === 'SelfDrive'
              ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Self-Drive Staff / Owners
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            driverTypeFilter === 'SelfDrive' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'
          }`}>
            {drivers.filter(d => d.isSelfDrive).length}
          </span>
        </button>
        <button
          onClick={() => setDriverTypeFilter('All')}
          className={`px-5 py-2.5 font-display text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            driverTypeFilter === 'All'
              ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All Roster
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            driverTypeFilter === 'All' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'
          }`}>
            {drivers.length}
          </span>
        </button>
      </div>

      {/* Control Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl glass-panel border border-slate-800">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search drivers by Name, Phone, License No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 rounded-lg text-sm text-slate-200 border border-slate-800/80 focus:border-emerald-500/50 outline-none placeholder-slate-500"
          />
        </div>

        {/* Department filter dropdown */}
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

      {/* Table Panel */}
      <div className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
        {filteredDrivers.length === 0 ? (
          <div className="py-16 text-center">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No drivers logged matching the criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Add a new driver to start assignments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Driver Name</th>
                  <th className="py-3.5 px-4">Phone Roster</th>
                  <th className="py-3.5 px-4">License No</th>
                  <th className="py-3.5 px-4">Department Unit</th>
                  <th className="py-3.5 px-4">License Expiry</th>
                  <th className="py-3.5 px-4">Assigned Transit</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {filteredDrivers.map((driver) => {
                  const matchingAllotment = allotments.find(a => a.driverId === driver.id);
                  const activeVehicle = matchingAllotment 
                    ? vehicles.find(v => v.id === matchingAllotment.vehicleId) 
                    : null;

                  // License Expiry alert coloring
                  const isExpired = new Date(driver.licenseExpiryDate) < new Date('2026-07-11');
                  const isSoonExpiring = !isExpired && (new Date(driver.licenseExpiryDate) < new Date('2026-10-11')); // within 3 months

                  return (
                    <tr key={driver.id} className="hover:bg-slate-900/20 transition-all duration-150">
                      
                      {/* Driver Name */}
                      <td className="py-4 px-6 font-semibold text-slate-100">
                        <div className="flex flex-col gap-0.5">
                          <span>{driver.name}</span>
                          {driver.isSelfDrive && (
                            <span className="inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20">
                              Self Drive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone contact */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{driver.phone}</span>
                        </div>
                      </td>

                      {/* License Number badge */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">
                        {driver.licenseNo}
                      </td>

                      {/* Assigned corporate department */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-emerald-400 border border-slate-800">
                          {driver.assignedDepartment}
                        </span>
                      </td>

                      {/* License Expiry date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className={`w-3.5 h-3.5 ${
                            isExpired ? 'text-red-400' : isSoonExpiring ? 'text-orange-400' : 'text-slate-500'
                          }`} />
                          <span className={`font-mono ${
                            isExpired 
                              ? 'text-red-400 font-bold' 
                              : isSoonExpiring 
                                ? 'text-orange-400 font-medium animate-pulse' 
                                : 'text-slate-300'
                          }`}>
                            {driver.licenseExpiryDate}
                          </span>
                        </div>
                      </td>

                      {/* Active Allotment vehicle plate reference */}
                      <td className="py-4 px-4">
                        {activeVehicle ? (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            {activeVehicle.vehicleNo}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">None Assigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => openEditModal(driver)}
                                title="Edit Driver"
                                className="p-1.5 bg-slate-900 rounded-lg hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete driver ${driver.name}? This will remove associated allotments.`)) {
                                    onDeleteDriver(driver.id);
                                  }
                                }}
                                title="Delete Driver"
                                className="p-1.5 bg-slate-900 rounded-lg hover:bg-red-500/20 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openEditModal(driver)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1e293b] text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                              title="View Details"
                            >
                              <Info className="w-3 h-3 text-indigo-400" />
                              <span>View Info</span>
                            </button>
                          )}
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
                {editingDriver ? `Edit Driver: ${editingDriver.name}` : 'Register New Company Driver'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <fieldset disabled={!isAdmin} className="space-y-4">
              
              {/* Self Drive Toggle */}
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  id="isSelfDrive"
                  checked={isSelfDrive}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSelfDrive(checked);
                    if (checked) {
                      if (!phone) setPhone('N/A');
                      if (!licenseNo) setLicenseNo('SELF-DRIVE');
                      if (!licenseExpiryDate) setLicenseExpiryDate('2099-12-31');
                    } else {
                      if (phone === 'N/A') setPhone('');
                      if (licenseNo === 'SELF-DRIVE') setLicenseNo('');
                      if (licenseExpiryDate === '2099-12-31') setLicenseExpiryDate('');
                    }
                  }}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isSelfDrive" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  Self-Drive Profile <span className="text-[10px] text-slate-500 font-normal ml-1">(Vehicle driven by owner/staff themselves)</span>
                </label>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Mobile Phone No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                />
              </div>

              {/* License Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Driving License No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LHR-87654-A"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">License Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                {/* Assigned Department */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assigned Department</label>
                  <select
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value as Driver['assignedDepartment'])}
                    className="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-200 border border-slate-800 focus:border-emerald-500/50 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="SCM">SCM</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Sale">Sale</option>
                    <option value="Admin">Admin</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>
              </fieldset>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  {isAdmin ? 'Cancel' : 'Close'}
                </button>
                {isAdmin && (
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all glow-emerald cursor-pointer"
                  >
                    {editingDriver ? 'Update Driver' : 'Register Driver'}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
