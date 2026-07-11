import React, { useState } from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle, Driver } from '../types';
import { 
  Receipt, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Fuel, 
  Wrench, 
  Car, 
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';

interface BillsTabProps {
  fuelEntries: FuelEntry[];
  maintenanceEntries: MaintenanceEntry[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onEditFuelEntry: (entry: FuelEntry) => void;
  onEditMaintenanceEntry: (entry: MaintenanceEntry) => void;
  onViewInvoice: (type: 'fuel' | 'maintenance', item: any) => void;
}

interface CombinedBill {
  id: string;
  sourceType: 'fuel' | 'maintenance';
  date: string;
  category: string;
  vehicleNo: string;
  driverName: string;
  referenceName: string; // pump or workshop
  amount: number;
  status: 'Pending' | 'Completed';
  details: string;
  rawEntry: any;
}

export const BillsTab: React.FC<BillsTabProps> = ({
  fuelEntries,
  maintenanceEntries,
  vehicles,
  drivers,
  onEditFuelEntry,
  onEditMaintenanceEntry,
  onViewInvoice
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'fuel' | 'maintenance'>('All');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Combine fuel entries and maintenance entries into a single billing ledger
  const bills: CombinedBill[] = [
    ...fuelEntries.map(f => {
      const vehicle = vehicles.find(v => v.id === f.vehicleId);
      const driver = drivers.find(d => d.id === f.driverId);
      return {
        id: f.id,
        sourceType: 'fuel' as const,
        date: f.date,
        category: 'Fuel Allotment',
        vehicleNo: vehicle ? vehicle.vehicleNo : 'Unknown',
        driverName: driver ? driver.name : 'Unknown Driver',
        referenceName: f.pumpName,
        amount: f.totalAmount,
        status: f.status || 'Completed', // Default older ones to Completed
        details: `${f.litres} Liters @ PKR ${f.ratePerLitre}/L`,
        rawEntry: f
      };
    }),
    ...maintenanceEntries.map(m => {
      const vehicle = vehicles.find(v => v.id === m.vehicleId);
      const driver = m.driverId ? drivers.find(d => d.id === m.driverId) : undefined;
      return {
        id: m.id,
        sourceType: 'maintenance' as const,
        date: m.date,
        category: m.maintenanceType || 'Workshop Maintenance',
        vehicleNo: vehicle ? vehicle.vehicleNo : 'Unknown',
        driverName: driver ? driver.name : 'Workshop Job',
        referenceName: m.workshopName,
        amount: m.totalCost,
        status: m.status || 'Completed',
        details: `Parts: PKR ${m.partsCost.toLocaleString()} | Labor: PKR ${m.laborCost.toLocaleString()}`,
        rawEntry: m
      };
    })
  ];

  // Apply filters
  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.referenceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
    const matchesType = typeFilter === 'All' || bill.sourceType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort
  const sortedBills = [...filteredBills].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  // Totals calculations
  const totalOutstanding = bills
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalCleared = bills
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalBilling = bills.reduce((sum, b) => sum + b.amount, 0);

  // Toggle status handler
  const handleToggleStatus = (bill: CombinedBill) => {
    const nextStatus = bill.status === 'Pending' ? 'Completed' : 'Pending';
    if (bill.sourceType === 'fuel') {
      onEditFuelEntry({
        ...bill.rawEntry,
        status: nextStatus
      });
    } else {
      onEditMaintenanceEntry({
        ...bill.rawEntry,
        status: nextStatus
      });
    }
  };

  // Download individual Bill as formatted text file
  const handleDownloadBill = (bill: CombinedBill) => {
    const textContent = `
=========================================
      VISION FOOD & PACKAGING LAHORE
             OFFICIAL RECEIPT
=========================================
Receipt ID:  ${bill.id}
Date:        ${bill.date}
Type:        ${bill.sourceType.toUpperCase()}
Category:    ${bill.category}
Status:      ${bill.status === 'Pending' ? 'PENDING / UNPAID' : 'PAID / CLEARED'}
-----------------------------------------
Vehicle No:  ${bill.vehicleNo}
Driver/Rider:${bill.driverName}
Merchant:    ${bill.referenceName}
-----------------------------------------
Breakdown / Details:
${bill.details}

-----------------------------------------
TOTAL AMOUNT: PKR ${bill.amount.toLocaleString()}
=========================================
        SAFE INSIDE - CHUNG LAHORE
=========================================
`;
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${bill.sourceType}_${bill.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download all current filtered ledger list as CSV
  const handleDownloadLedgerCSV = () => {
    const headers = ['Date', 'Bill ID', 'Type', 'Category', 'Vehicle No', 'Driver/Rider', 'Vendor', 'Details', 'Amount (PKR)', 'Status'];
    const rows = sortedBills.map(b => [
      b.date,
      b.id,
      b.sourceType,
      b.category,
      b.vehicleNo,
      b.driverName,
      b.referenceName,
      b.details.replace(/,/g, ' |'),
      b.amount,
      b.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vision_Billing_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" /> Company Billing Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track outstanding pump logs, maintenance bills, workshop charges, and download invoices.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleDownloadLedgerCSV}
          disabled={sortedBills.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b] hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Outstanding Card */}
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 glow-amber/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">Pending Bills (Outstanding)</span>
            <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
              PKR {totalOutstanding.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">Needs processing & clearing approval</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Cleared Card */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 glow-emerald/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Cleared Bills (Paid)</span>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
              PKR {totalCleared.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">Successfully settled and verified</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Combined Ledger Turnover */}
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 glow-indigo/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80">Total Expense Logged</span>
            <div className="text-2xl md:text-3xl font-black text-indigo-400 font-mono">
              PKR {totalBilling.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">Combined Fuel & Maintenance budget</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Vehicle No, Driver/Rider, or Workshop/Pump name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60 transition-all font-sans"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTypeFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === 'All' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('fuel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  typeFilter === 'fuel' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Fuel className="w-3 h-3" /> Fuel
              </button>
              <button
                onClick={() => setTypeFilter('maintenance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  typeFilter === 'maintenance' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-3 h-3" /> Repairs
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'All' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3 h-3" /> Pending
              </button>
              <button
                onClick={() => setStatusFilter('Completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle className="w-3 h-3" /> Paid
              </button>
            </div>
          </div>
        </div>

        {/* Sorting options */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/50 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Sort Ledger by:</span>
            <button
              onClick={() => {
                if (sortField === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('date'); setSortOrder('desc'); }
              }}
              className={`flex items-center gap-1 font-semibold hover:text-white transition-colors cursor-pointer ${sortField === 'date' ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'amount') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortField('amount'); setSortOrder('desc'); }
              }}
              className={`flex items-center gap-1 font-semibold hover:text-white transition-colors cursor-pointer ${sortField === 'amount' ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          <span className="text-slate-500">Showing {sortedBills.length} matched vouchers</span>
        </div>
      </div>

      {/* Bills Ledger List */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
        {sortedBills.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-slate-300 font-bold">No Billing Logs Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any bills matching your search filters. Try clearing some search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/30 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-4">Bill Type & Category</th>
                  <th className="py-4 px-4">Vehicle No</th>
                  <th className="py-4 px-4">Driver / Rider</th>
                  <th className="py-4 px-4">Merchant / Supplier</th>
                  <th className="py-4 px-4 text-right">Amount</th>
                  <th className="py-4 px-4 text-center">Payment Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedBills.map((bill) => {
                  const isPending = bill.status === 'Pending';
                  return (
                    <tr 
                      key={bill.id} 
                      className={`hover:bg-slate-900/20 transition-colors text-slate-300 ${
                        isPending ? 'bg-amber-500/[0.01]' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-4 px-5 font-mono text-xs whitespace-nowrap">
                        {bill.date}
                      </td>

                      {/* Type & Category */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg border ${
                            bill.sourceType === 'fuel' 
                              ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' 
                              : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                          }`}>
                            {bill.sourceType === 'fuel' ? <Fuel className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-slate-200">{bill.category}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">ID: {bill.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle plate */}
                      <td className="py-4 px-4 font-bold text-xs">
                        <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                          {bill.vehicleNo}
                        </span>
                      </td>

                      {/* Driver/Rider */}
                      <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                        {bill.driverName}
                      </td>

                      {/* Merchant */}
                      <td className="py-4 px-4 text-xs">
                        <span className="text-slate-400 font-medium">{bill.referenceName}</span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-xs text-slate-100">
                        PKR {bill.amount.toLocaleString()}
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(bill)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
                            isPending
                              ? 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20 hover:scale-105'
                              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                          {isPending ? 'Pending' : 'Paid / Cleared'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle status shortcut button */}
                          <button
                            onClick={() => handleToggleStatus(bill)}
                            title={isPending ? "Mark as Paid" : "Mark as Pending"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/40 transition-colors cursor-pointer"
                          >
                            <CheckCircle className={`w-3.5 h-3.5 ${!isPending ? 'text-emerald-500' : ''}`} />
                          </button>

                          {/* Print Invoice modal trigger */}
                          <button
                            onClick={() => onViewInvoice(bill.sourceType, bill.rawEntry)}
                            title="Print slip"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/40 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* Text File Download */}
                          <button
                            onClick={() => handleDownloadBill(bill)}
                            title="Download details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/40 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* Guide Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2.5">
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase text-emerald-400">INFO</span>
        <p className="leading-relaxed">
          <strong>Tip:</strong> Toggle a voucher's payment status easily by clicking on its status pill (e.g. <em>Pending</em> or <em>Paid / Cleared</em>). Setting a voucher to cleared automatically syncs back with the fuel or maintenance log databases. Click the printer icon to load the official Printable Receipt Slip, or download individual reports as structured text receipts.
        </p>
      </div>
    </div>
  );
};
