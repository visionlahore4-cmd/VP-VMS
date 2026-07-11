import React from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle, Driver } from '../types';
import { X, Printer, Shield } from 'lucide-react';
import { VisionPackagingLogo } from './VisionPackagingLogo';

interface InvoiceModalProps {
  type: 'fuel' | 'maintenance' | null;
  item: any; // FuelEntry or MaintenanceEntry
  vehicles: Vehicle[];
  drivers: Driver[];
  serialNumber?: string;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  type,
  item,
  vehicles,
  drivers,
  serialNumber,
  onClose
}) => {
  if (!type || !item) return null;

  const vehicle = vehicles.find((v) => v.id === item.vehicleId);
    const driver = drivers.find((d) => d.id === item.driverId) || (vehicle ? drivers.find((d) => d.id === vehicle.assignedDriverId) : null);

  const handlePrint = () => {
    window.print();
  };

  const isFuel = type === 'fuel';
  const defaultSerialNo = isFuel
    ? `FUEL-${item.id.split('-')[1]?.toLowerCase() || 'kocvvd'}`
    : `MNT-${item.id.split('-')[1]?.toLowerCase() || 'vvd98z'}`;
  const serialNo = serialNumber || defaultSerialNo;

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
          <div id="printable-voucher" className="relative w-full min-w-[560px] bg-white text-slate-900 p-10 shadow-xl border border-slate-200 rounded-sm font-sans select-text">
            
            {/* Voucher Top Header */}
            <div className="flex justify-between items-start">
              
              {/* Brand Logo & Department */}
              <div className="flex items-center gap-4">
                <VisionPackagingLogo layout="vertical" size="md" showText={false} light={true} />
                <div>
                  <h1 className="text-2xl font-black text-[#154294] leading-[1.1] tracking-tight font-sans">
                    Vision Food &<br />Packaging
                  </h1>
                  <p className="text-[9px] font-bold text-slate-500 tracking-[0.15em] uppercase mt-1.5 leading-none">
                    FLEET MANAGEMENT DEPARTMENT
                  </p>
                </div>
              </div>

              {/* Voucher Details */}
              <div className="text-right">
                <h2 className="text-sm font-black text-[#154294] uppercase tracking-wider font-sans">
                  VOUCHER DETAILS
                </h2>
                <div className="mt-3 space-y-1 text-xs text-slate-700 font-sans">
                  <p><span className="font-semibold text-slate-500">Voucher No:</span> <span className="font-mono font-bold text-slate-900">{serialNo}</span></p>
                  <p><span className="font-semibold text-slate-500">Date Generated:</span> <span className="font-bold text-slate-900">{item.date}</span></p>
                </div>
              </div>

            </div>

            {/* Metadata Rows */}
            <div className="mt-6 space-y-1 text-xs text-slate-700 font-sans">
              <p className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Company Name:</span>
                <span>Vision Food & Packaging</span>
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
            <div className="my-5 h-[2px] bg-slate-900"></div>

            {/* Main Voucher Table */}
            <div className="mt-4 border border-slate-200 rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#154294] text-white font-bold uppercase tracking-wide text-[10px]">
                    {isFuel ? (
                      <>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">DATE</th>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">VEHICLE NO#</th>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">VENDOR/PUMP</th>
                        <th className="py-3 px-4 text-center border-r border-blue-800 font-sans">LITRES</th>
                        <th className="py-3 px-4 text-right border-r border-blue-800 font-sans">RATE (PKR)</th>
                        <th className="py-3 px-4 text-right font-sans">AMOUNT (PKR)</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">DATE</th>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">VEHICLE NO#</th>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">MAINTENANCE TYPE</th>
                        <th className="py-3 px-4 text-left border-r border-blue-800 font-sans">WORKSHOP/VENDOR</th>
                        <th className="py-3 px-4 text-right font-sans">TOTAL COST (PKR)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {isFuel ? (
                    <>
                      <tr className="bg-white">
                        <td className="py-3.5 px-4 font-medium border-r border-slate-200 font-mono text-xs">{item.date}</td>
                        <td className="py-3.5 px-4 font-bold text-[#154294] border-r border-slate-200 font-sans text-xs">{vehicle?.vehicleNo || 'N/A'}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600 border-r border-slate-200 uppercase font-sans text-xs">
                          <div>{item.pumpName || 'N/A'}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{fuelType}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold border-r border-slate-200 font-mono text-xs">{Number(item.litres).toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-mono border-r border-slate-200 text-xs">{Number(item.ratePerLitre).toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#154294] font-mono text-xs">PKR {Number(item.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      {/* Total row */}
                      <tr className="bg-white font-bold border-t border-slate-200">
                        <td colSpan={4} className="py-3.5 px-4 border-r border-slate-200"></td>
                        <td className="py-3.5 px-4 text-right uppercase tracking-wider text-slate-900 text-[10px] font-sans font-bold border-r border-slate-200">GRAND TOTAL</td>
                        <td className="py-3.5 px-4 text-right text-[#154294] font-black font-mono text-xs">
                          PKR {Number(item.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="bg-white">
                        <td className="py-3.5 px-4 font-medium border-r border-slate-200 font-mono text-xs">{item.date}</td>
                        <td className="py-3.5 px-4 font-bold text-[#154294] border-r border-slate-200 font-sans text-xs">{vehicle?.vehicleNo || 'N/A'}</td>
                        <td className="py-3.5 px-4 border-r border-slate-200 font-semibold text-slate-700 font-sans text-xs">{item.maintenanceType || 'Maintenance Work'}</td>
                        <td className="py-3.5 px-4 border-r border-slate-200 font-semibold text-slate-700 font-sans text-xs">
                          <div>{item.workshopName}</div>
                          {item.vendorAddress && <div className="text-[10px] text-slate-500 mt-0.5">{item.vendorAddress}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#154294] font-mono text-xs">PKR {Number(item.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      {/* Total row */}
                      <tr className="bg-white font-bold border-t border-slate-200">
                        <td colSpan={3} className="py-3.5 px-4 border-r border-slate-200"></td>
                        <td className="py-3.5 px-4 text-right uppercase tracking-wider text-slate-900 text-[10px] font-sans font-bold border-r border-slate-200">GRAND TOTAL</td>
                        <td className="py-3.5 px-4 text-right text-[#154294] font-black font-mono text-xs">
                          PKR {Number(item.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Stamp block */}
            <div className="relative mt-8 flex justify-end h-12">
              <div className="absolute right-10 -top-2 z-10">
                <div className="border-[3px] border-double border-[#059669] text-[#059669] font-mono font-black text-sm uppercase tracking-widest px-6 py-1.5 rounded rotate-[5deg] bg-white select-none pointer-events-none shadow-sm">
                  PAID
                </div>
              </div>
            </div>

            {/* Extra details for validation (e.g. Odometer / Pump or Next Service) */}
            <div className="mt-2 grid grid-cols-2 gap-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3 font-mono">
              {isFuel ? (
                <>
                  <p><span className="font-bold uppercase">Filling Pump Station:</span> <span className="font-medium text-slate-700">{item.pumpName}</span></p>
                  <p className="text-right"><span className="font-bold uppercase">Odometer Log:</span> <span className="font-medium text-slate-700">{Number(item.odometerReading).toLocaleString()} km</span></p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold uppercase">Work Status:</span> <span className="font-medium text-emerald-600 font-bold">{item.status}</span>
                    {item.notes && <span className="block text-slate-600 mt-1"><span className="font-bold">NOTES:</span> {item.notes}</span>}
                  </p>
                  <p className="text-right">
                    {item.currentReading !== undefined && <span className="block"><span className="font-bold uppercase">Odometer Current:</span> <span className="font-medium text-slate-700">{Number(item.currentReading).toLocaleString()} KM</span></span>}
                    {item.nextReading !== undefined && <span className="block mt-0.5"><span className="font-bold uppercase">Next Service due (odometer):</span> <span className="font-semibold text-rose-600">{Number(item.nextReading).toLocaleString()} KM</span></span>}
                    {item.nextMaintenanceDate && <span className="block mt-0.5"><span className="font-bold uppercase">Next Scheduled Date:</span> <span className="font-medium text-slate-700">{item.nextMaintenanceDate}</span></span>}
                  </p>
                </>
              )}
            </div>

            {/* Signature Area (Solid Black Lines centered, exactly matching screenshot) */}
            <div className="mt-16 flex justify-between px-10 text-xs text-slate-950 font-bold font-sans">
              <div className="text-center w-48">
                <div className="w-full border-b-2 border-slate-900 mb-2.5"></div>
                <p className="font-semibold text-slate-900 text-xs">Admin Officer</p>
              </div>
              <div className="text-center w-48">
                <div className="w-full border-b-2 border-slate-900 mb-2.5"></div>
                <p className="font-semibold text-slate-900 text-xs">Admin Manager</p>
              </div>
            </div>

            {/* Footer Location Block */}
            <div className="w-full h-[1px] bg-slate-200 mt-12 mb-4"></div>
            <div className="text-center text-[10px] text-slate-400 font-medium tracking-wide font-sans">
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
