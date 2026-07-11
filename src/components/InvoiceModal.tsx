import React from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle, Driver } from '../types';
import { X, Printer, Shield, ChevronRight } from 'lucide-react';

interface InvoiceModalProps {
  type: 'fuel' | 'maintenance' | null;
  item: any; // FuelEntry or MaintenanceEntry
  vehicles: Vehicle[];
  drivers: Driver[];
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  type,
  item,
  vehicles,
  drivers,
  onClose
}) => {
  if (!type || !item) return null;

  const vehicle = vehicles.find((v) => v.id === item.vehicleId);
  const driver = type === 'fuel' ? drivers.find((d) => d.id === (item as FuelEntry).driverId) : null;

  const handlePrint = () => {
    window.print();
  };

  const isFuel = type === 'fuel';
  const serialNo = `VMH-${isFuel ? 'FUL' : 'MNT'}-${item.id.split('-')[1]?.toUpperCase() || '0429'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print">
      <div className="w-full max-w-lg rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <h3 className="font-display font-bold text-slate-100 text-lg flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" /> Dispatch Voucher Preview
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body (Interactive Screen View) */}
        <div className="p-6 space-y-6">
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-900 flex flex-col gap-6 text-slate-300">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-900 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Official Receipt</span>
                <h4 className="text-sm font-bold text-slate-100 font-display mt-0.5">VEHICLE HUB LTD</h4>
                <p className="text-[10px] text-slate-500">Corporate Fleet Logistics Division</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold font-mono text-slate-500">Voucher No.</span>
                <p className="text-xs font-bold font-mono text-emerald-400">{serialNo}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.date}</p>
              </div>
            </div>

            {/* Core Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Vehicle Details:</span>
                <p className="font-bold text-slate-200 font-mono">{vehicle?.vehicleNo || 'Unknown'}</p>
                <p className="text-slate-400 text-[10px]">{vehicle?.modelName} ({vehicle?.vehicleType})</p>
              </div>
              
              {isFuel ? (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Designated Driver:</span>
                  <p className="font-bold text-slate-200 flex items-center gap-1.5 flex-wrap">
                    <span>{driver?.name || 'Unknown'}</span>
                    {driver?.isSelfDrive && (
                      <span className="text-[8px] bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1 py-0.2 rounded font-mono">SELF DRIVE</span>
                    )}
                  </p>
                  <p className="text-slate-400 text-[10px]">{driver?.phone}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Workshop Facility:</span>
                  <p className="font-bold text-slate-200">{(item as MaintenanceEntry).workshopName}</p>
                  <p className="text-slate-400 text-[10px]">Marked Status: {(item as MaintenanceEntry).status}</p>
                </div>
              )}
            </div>

            {/* Receipt line items details */}
            <div className="border-t border-b border-slate-900 py-3 space-y-2 text-xs">
              {isFuel ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fuel Vol (Litres):</span>
                    <span className="font-mono text-slate-300">{(item as FuelEntry).litres} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rate per Litre:</span>
                    <span className="font-mono text-slate-300">PKR {(item as FuelEntry).ratePerLitre.toLocaleString()} / L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Odometer Log:</span>
                    <span className="font-mono text-slate-300">{(item as FuelEntry).odometerReading.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Filling Pump Station:</span>
                    <span className="text-slate-300">{(item as FuelEntry).pumpName}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mechanical Parts Cost:</span>
                    <span className="font-mono text-slate-300">PKR {(item as MaintenanceEntry).partsCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Workshop Labor Cost:</span>
                    <span className="font-mono text-slate-300">PKR {(item as MaintenanceEntry).laborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold text-emerald-400">Next Service Threshold:</span>
                    <span className="font-mono text-emerald-400">{(item as MaintenanceEntry).nextMaintenanceDate}</span>
                  </div>
                </>
              )}
            </div>

            {/* Total voucher sum */}
            <div className="flex justify-between items-center bg-slate-900 px-4 py-3.5 rounded-lg border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grand Total:</span>
              <span className="text-base font-black font-mono text-emerald-400">
                PKR {isFuel ? (item as FuelEntry).totalAmount.toLocaleString() : (item as MaintenanceEntry).totalCost.toLocaleString()}
              </span>
            </div>

            {/* Signature slots placeholders */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-[9px] text-slate-500 border-t border-slate-900/40">
              <div className="border-t border-dashed border-slate-800 pt-1 text-center">
                Logistics Dispatcher Signature
              </div>
              <div className="border-t border-dashed border-slate-800 pt-1 text-center">
                Vehicle Driver Signature
              </div>
            </div>

          </div>
        </div>

        {/* Modal Operations Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg cursor-pointer shadow-lg shadow-emerald-500/20 font-sans transition-all"
          >
            <Printer className="w-4 h-4" /> Print Voucher Slip
          </button>
        </div>

      </div>

      {/* DEDICATED STATIC PRINT LAYOUT (HIDES DURING NORMAL SCREEN VIEW but shows when calling window.print()) */}
      <div className="hidden print-only print-container fixed inset-0 bg-white text-black p-10 font-sans z-50">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight uppercase">Vehicle Management Hub</h2>
              <p className="text-xs text-gray-600">Corporate Fleet Logistics Ledger System</p>
              <p className="text-xs text-gray-600">Location: Lahore Corporate Head Office</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Voucher No:</p>
              <h3 className="text-sm font-mono font-bold">{serialNo}</h3>
              <p className="text-xs text-gray-500 mt-1">Issue Date: {item.date}</p>
            </div>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wider text-center py-1 bg-gray-100 border border-black">
            {isFuel ? 'Fuel Disbursement Slip' : 'Mechanical Maintenance Receipt'}
          </h3>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold underline uppercase">Vehicle Details</h4>
              <p><strong>Plate No:</strong> {vehicle?.vehicleNo || 'N/A'}</p>
              <p><strong>Model:</strong> {vehicle?.modelName || 'N/A'}</p>
              <p><strong>Engine Capacity:</strong> {vehicle?.engineCC || 'N/A'} CC</p>
              <p><strong>Chassis No:</strong> {vehicle?.chassisNo || 'N/A'}</p>
              <p><strong>Engine No:</strong> {vehicle?.engineNo || 'N/A'}</p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold underline uppercase">Assignment Details</h4>
              {isFuel ? (
                <>
                  <p><strong>Primary Driver:</strong> {driver?.name || 'N/A'}</p>
                  <p><strong>Driver Contact:</strong> {driver?.phone || 'N/A'}</p>
                  <p><strong>License Code:</strong> {driver?.licenseNo || 'N/A'}</p>
                  <p><strong>Department:</strong> {driver?.assignedDepartment || 'N/A'}</p>
                </>
              ) : (
                <>
                  <p><strong>Workshop Facility:</strong> {(item as MaintenanceEntry).workshopName}</p>
                  <p><strong>Repair Status:</strong> {(item as MaintenanceEntry).status}</p>
                  <p><strong>Next Tune-Up Threshold:</strong> {(item as MaintenanceEntry).nextMaintenanceDate}</p>
                </>
              )}
            </div>
          </div>

          {/* Line items Table */}
          <div className="border border-black mt-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-black font-bold uppercase">
                  <th className="p-2 border-r border-black">Operational Metric Item</th>
                  <th className="p-2 text-right">Details / Volumes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {isFuel ? (
                  <>
                    <tr>
                      <td className="p-2 border-r border-black">Disbursed Fuel Volume (Litres)</td>
                      <td className="p-2 text-right">{(item as FuelEntry).litres} Litres</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black">Rate per Litre</td>
                      <td className="p-2 text-right">PKR {(item as FuelEntry).ratePerLitre.toLocaleString()} / L</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black">Odometer Reading at Refuel</td>
                      <td className="p-2 text-right">{(item as FuelEntry).odometerReading.toLocaleString()} km</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black">Filling Pump Station</td>
                      <td className="p-2 text-right">{(item as FuelEntry).pumpName}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="p-2 border-r border-black">Automotive Replacement Parts Cost</td>
                      <td className="p-2 text-right">PKR {(item as MaintenanceEntry).partsCost.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black">Workshop Mechanical Labor Cost</td>
                      <td className="p-2 text-right">PKR {(item as MaintenanceEntry).laborCost.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black">Scheduled Preventive Maintenance Expiry</td>
                      <td className="p-2 text-right">{(item as MaintenanceEntry).nextMaintenanceDate}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand total printed large */}
          <div className="flex justify-between items-center border-2 border-black p-3 font-bold bg-gray-50">
            <span className="uppercase text-xs">Voucher Grand Total:</span>
            <span className="text-sm font-mono">
              PKR {isFuel ? (item as FuelEntry).totalAmount.toLocaleString() : (item as MaintenanceEntry).totalCost.toLocaleString()}
            </span>
          </div>

          {/* Formal Stamp Area */}
          <div className="pt-12 grid grid-cols-2 gap-12 text-[10px] text-gray-700">
            <div className="border-t border-black pt-1.5 text-center">
              Authorized Logistics Supervisor Stamp
            </div>
            <div className="border-t border-black pt-1.5 text-center">
              Active Duty Driver / Personnel Signature
            </div>
          </div>

          {/* Verification disclaimer */}
          <div className="pt-8 text-center text-[9px] text-gray-500 border-t border-gray-200">
            Document generated securely via Vehicle Management Hub corporate sandbox storage. Re-verification can occur on-site.
          </div>
        </div>
      </div>

    </div>
  );
};
