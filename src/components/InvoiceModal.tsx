import React from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle, Driver } from '../types';
import { X, Printer, Shield } from 'lucide-react';

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
    const driver = drivers.find((d) => d.id === item.driverId) || (vehicle ? drivers.find((d) => d.id === vehicle.assignedDriverId) : null);

  const handlePrint = () => {
    window.print();
  };

  const isFuel = type === 'fuel';
  const serialNo = isFuel
    ? `FUEL-${item.id.split('-')[1]?.toLowerCase() || 'kocvvd'}`
    : `MNT-${item.id.split('-')[1]?.toLowerCase() || 'vvd98z'}`;

  // Automatically determine fuel type
  const getFuelType = (v: Vehicle | undefined) => {
    if (!v) return 'PETROL';
    if (v.vehicleType === 'Truck') return 'DIESEL';
    if (v.vehicleNo.toUpperCase().includes('DSL') || v.modelName.toUpperCase().includes('DIESEL')) return 'DIESEL';
    return 'PETROL';
  };

  const fuelType = getFuelType(vehicle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Window Control Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <h3 className="font-display font-bold text-slate-100 text-sm flex items-center gap-2 tracking-wide uppercase">
            Printable Invoice
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outer body with a subtle dark background in modal, centering the pristine white voucher */}
        <div className="p-6 bg-slate-900/60 overflow-x-auto">
          
          {/* THE PAPER VOUCHER (Matches Screenshot EXACTLY) */}
          <div id="printable-voucher" className="relative w-full min-w-[560px] bg-white text-slate-900 p-8 shadow-xl border border-slate-200 rounded-sm font-sans select-text">
            
            {/* Stamp Overlay */}
            {isFuel ? (
              <div className="absolute right-16 bottom-36 border-4 border-double border-emerald-600/90 text-emerald-600/90 font-mono font-black text-lg uppercase tracking-[0.2em] px-6 py-2 rounded rotate-[-9deg] bg-emerald-50/20 select-none pointer-events-none z-10">
                APPROVED
              </div>
            ) : (
              (item as MaintenanceEntry).status === 'Pending' ? (
                <div className="absolute right-16 bottom-36 border-4 border-double border-orange-500/90 text-orange-500/90 font-mono font-black text-lg uppercase tracking-[0.2em] px-6 py-2 rounded rotate-[-9deg] bg-orange-50/20 select-none pointer-events-none z-10">
                  PENDING
                </div>
              ) : (
                <div className="absolute right-16 bottom-36 border-4 border-double border-emerald-600/90 text-emerald-600/90 font-mono font-black text-lg uppercase tracking-[0.2em] px-6 py-2 rounded rotate-[-9deg] bg-emerald-50/20 select-none pointer-events-none z-10">
                  APPROVED
                </div>
              )
            )}

            {/* Voucher Top Header */}
            <div className="flex justify-between items-start">
              
              {/* Brand Logo & Department */}
              <div className="flex items-start gap-3">
                {/* Recreated Logo */}
                <div className="flex-shrink-0 w-11 h-11 bg-[#1a1f38] rounded-full flex items-center justify-center text-white font-black text-lg font-display tracking-tighter shadow-sm">
                  VP
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-blue-900 leading-none tracking-tight">
                    Vision Packs
                  </h1>
                  <h1 className="text-xl font-extrabold text-blue-900 leading-none tracking-tight mt-0.5">
                    Automobile
                  </h1>
                  <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                    FLEET MANAGEMENT DEPARTMENT
                  </p>
                </div>
              </div>

              {/* Voucher Details */}
              <div className="text-right">
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">
                  VOUCHER DETAILS
                </h2>
                <div className="mt-1.5 space-y-0.5 text-xs text-slate-700">
                  <p><span className="font-semibold text-slate-500">Voucher No:</span> <span className="font-mono font-bold text-slate-900">{serialNo}</span></p>
                  <p><span className="font-semibold text-slate-500">Date Generated:</span> <span className="font-bold text-slate-900">{item.date}</span></p>
                </div>
              </div>

            </div>

            {/* Metadata Rows */}
            <div className="mt-6 space-y-1 text-xs text-slate-700">
              <p className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Company Name:</span>
                <span>Vision Packs Automobile</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Report Type:</span>
                <span>{isFuel ? 'Fuel Expenses Voucher' : 'Maintenance Expenses Voucher'}</span>
              </p>
              {driver && (
                <p className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">Driver Assignment:</span>
                  <span>{driver.name} {driver.employeeId ? `(ID: ${driver.employeeId})` : ''} — {driver.designation || 'Active Driver'}</span>
                </p>
              )}
            </div>

            {/* Horizontal Line Break */}
            <hr className="my-4 border-t-2 border-slate-900" />

            {/* Main Voucher Table */}
            <div className="mt-4 border border-slate-200 rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white font-bold uppercase tracking-wider text-[10px]">
                    {isFuel ? (
                      <>
                        <th className="py-2.5 px-4 text-left border-r border-blue-800">DATE</th>
                        <th className="py-2.5 px-4 text-center border-r border-blue-800">VEHICLE NO#</th>
                        <th className="py-2.5 px-4 text-center border-r border-blue-800">FUEL TYPE</th>
                        <th className="py-2.5 px-4 text-center border-r border-blue-800">LITRES</th>
                        <th className="py-2.5 px-4 text-right border-r border-blue-800">RATE (PKR)</th>
                        <th className="py-2.5 px-4 text-right">AMOUNT (PKR)</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2.5 px-4 text-left border-r border-blue-800">DATE</th>
                        <th className="py-2.5 px-4 text-center border-r border-blue-800">VEHICLE NO#</th>
                        <th className="py-2.5 px-4 text-left border-r border-blue-800">MAINTENANCE WORK</th>
                        <th className="py-2.5 px-4 text-left border-r border-blue-800">VENDOR/WORKSHOP</th>
                        <th className="py-2.5 px-4 text-right">TOTAL COST (PKR)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {isFuel ? (
                    <>
                      <tr className="bg-white">
                        <td className="py-3 px-4 font-medium border-r border-slate-100">{item.date}</td>
                        <td className="py-3 px-4 text-center font-bold text-blue-900 border-r border-slate-100 font-mono">{vehicle?.vehicleNo || 'N/A'}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600 border-r border-slate-100 uppercase">{fuelType}</td>
                        <td className="py-3 px-4 text-center font-semibold border-r border-slate-100 font-mono">{Number(item.litres).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono border-r border-slate-100">{Number(item.ratePerLitre).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900 font-mono">PKR {Number(item.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      {/* Total row */}
                      <tr className="bg-slate-50 font-bold border-t border-slate-300">
                        <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider text-slate-500 text-[10px]"></td>
                        <td className="py-3 px-4 text-right uppercase tracking-wider text-slate-900 text-[10px] border-r border-slate-200">GRAND TOTAL</td>
                        <td className="py-3 px-4 text-right text-blue-900 font-black font-mono text-xs">
                          PKR {Number(item.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="bg-white">
                        <td className="py-3 px-4 font-medium border-r border-slate-100">{item.date}</td>
                        <td className="py-3 px-4 text-center font-bold text-blue-900 border-r border-slate-100 font-mono">{vehicle?.vehicleNo || 'N/A'}</td>
                        <td className="py-3 px-4 border-r border-slate-100 font-semibold text-slate-700">{item.maintenanceType || 'Maintenance Work'}</td>
                        <td className="py-3 px-4 border-r border-slate-100 font-semibold text-slate-700">
                          <div>{item.workshopName}</div>
                          {item.vendorAddress && <div className="text-[10px] text-slate-500 mt-0.5">{item.vendorAddress}</div>}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900 font-mono">PKR {Number(item.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      {/* Total row */}
                      <tr className="bg-slate-50 font-bold border-t border-slate-300">
                        <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-slate-500 text-[10px]"></td>
                        <td className="py-3 px-4 text-right uppercase tracking-wider text-slate-900 text-[10px] border-r border-slate-200">GRAND TOTAL</td>
                        <td className="py-3 px-4 text-right text-blue-900 font-black font-mono text-xs">
                          PKR {Number(item.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Extra details for validation (e.g. Odometer / Pump or Next Service) */}
            <div className="mt-5 grid grid-cols-2 gap-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
              {isFuel ? (
                <>
                  <p><span className="font-bold uppercase">Filling Pump Station:</span> <span className="font-medium text-slate-700">{item.pumpName}</span></p>
                  <p className="text-right"><span className="font-bold uppercase">Odometer Log:</span> <span className="font-mono font-medium text-slate-700">{Number(item.odometerReading).toLocaleString()} km</span></p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold uppercase">Work Status:</span> <span className="font-medium text-emerald-600 font-bold">{item.status}</span>
                    {item.notes && <span className="block text-slate-600 mt-1"><span className="font-bold">NOTES:</span> {item.notes}</span>}
                  </p>
                  <p className="text-right">
                    {item.currentReading !== undefined && <span className="block"><span className="font-bold uppercase">Odometer Current:</span> <span className="font-mono font-medium text-slate-700">{Number(item.currentReading).toLocaleString()} KM</span></span>}
                    {item.nextReading !== undefined && <span className="block mt-0.5"><span className="font-bold uppercase">Next Service due (odometer):</span> <span className="font-mono font-semibold text-rose-600">{Number(item.nextReading).toLocaleString()} KM</span></span>}
                    {item.nextMaintenanceDate && <span className="block mt-0.5"><span className="font-bold uppercase">Next Scheduled Date:</span> <span className="font-medium text-slate-700">{item.nextMaintenanceDate}</span></span>}
                  </p>
                </>
              )}
            </div>

            {/* Signature Area (Solid Black Lines centered, exactly matching screenshot) */}
            <div className="mt-16 grid grid-cols-2 gap-16 text-xs text-slate-900 font-bold">
              <div className="text-center">
                <div className="w-40 mx-auto border-b-2 border-slate-900 mb-2"></div>
                <p className="font-display">Admin Officer</p>
              </div>
              <div className="text-center">
                <div className="w-40 mx-auto border-b-2 border-slate-900 mb-2"></div>
                <p className="font-display">Admin Manager</p>
              </div>
            </div>

            {/* Footer Location Block */}
            <hr className="mt-12 mb-4 border-t border-slate-200" />
            <div className="text-center text-[10px] text-slate-400 font-medium tracking-wide">
              Vision Food & Packaging • Sunder Industrial Estate, Raiwind, Lahore
            </div>

          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 font-sans transition-all active:scale-95"
          >
            <Printer className="w-4.5 h-4.5" /> Print Voucher Slip
          </button>
        </div>

      </div>

      {/* DEDICATED STYLES FOR PRINT MEDIA */}
      <style>{`
        @media print {
          /* Hide everything except our specific voucher card */
          body * {
            visibility: hidden !important;
          }
          .no-print, .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          #printable-voucher, #printable-voucher * {
            visibility: visible !important;
          }
          #printable-voucher {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          /* Ensure table headers render backgrounds correctly in chrome/safari */
          th {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #1e3a8a !important; /* bg-blue-900 */
            color: white !important;
          }
          .bg-slate-50 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #f8fafc !important;
          }
          /* Ensure colored text is printed correctly */
          .text-blue-900 {
            color: #1e3a8a !important;
          }
          .text-emerald-600 {
            color: #059669 !important;
          }
          .border-emerald-600 {
            border-color: #059669 !important;
          }
          .text-orange-500 {
            color: #f97316 !important;
          }
          .border-orange-500 {
            border-color: #f97316 !important;
          }
        }
      `}</style>

    </div>
  );
};
