import React from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle, Driver } from '../types';
import { X, Printer, Shield, Download, CheckCircle, Clock } from 'lucide-react';
import { VisionPackagingLogo } from './VisionPackagingLogo';

interface InvoiceModalProps {
  type: 'fuel' | 'maintenance' | null;
  item: any; // FuelEntry or MaintenanceEntry
  vehicles: Vehicle[];
  drivers: Driver[];
  serialNumber?: string;
  onClose: () => void;
  onEditFuelEntry?: (entry: FuelEntry) => void;
  onEditMaintenanceEntry?: (entry: MaintenanceEntry) => void;
  isAdmin?: boolean;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  type,
  item,
  vehicles,
  drivers,
  serialNumber,
  onClose,
  onEditFuelEntry,
  onEditMaintenanceEntry,
  isAdmin = false
}) => {
  if (!type || !item) return null;

  const isFuel = type === 'fuel';
  const isArray = Array.isArray(item);
  const fuelEntriesList: FuelEntry[] = isArray ? (item as FuelEntry[]) : [item as FuelEntry];
  const firstEntry = fuelEntriesList[0];
  const totalSum = fuelEntriesList.reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const vehicle = vehicles.find((v) => v.id === firstEntry?.vehicleId);
  const driver = firstEntry ? (drivers.find((d) => d.id === firstEntry.driverId) || (vehicle ? drivers.find((d) => d.id === vehicle.assignedDriverId) : null)) : null;

  const isPending = isArray
    ? fuelEntriesList.some(e => e.status === 'Pending')
    : item?.status === 'Pending';

  const handlePrint = () => {
    window.print();
  };

  const defaultSerialNo = isFuel
    ? isArray
      ? `FUEL-BATCH-${firstEntry?.id.split('-')[1]?.toLowerCase() || 'kocvvd'}`
      : `FUEL-${firstEntry?.id.split('-')[1]?.toLowerCase() || 'kocvvd'}`
    : `MNT-${item.id.split('-')[1]?.toLowerCase() || 'vvd98z'}`;
  const serialNo = serialNumber || defaultSerialNo;

  const handleToggleStatus = () => {
    if (!type || !item) return;

    if (type === 'fuel') {
      if (isArray) {
        const nextStatus = fuelEntriesList.some(e => e.status === 'Pending') ? 'Completed' : 'Pending';
        fuelEntriesList.forEach(entry => {
          if (onEditFuelEntry) {
            onEditFuelEntry({
              ...entry,
              status: nextStatus
            });
          }
        });
      } else {
        const nextStatus = item.status === 'Pending' ? 'Completed' : 'Pending';
        if (onEditFuelEntry) {
          onEditFuelEntry({
            ...item,
            status: nextStatus
          });
        }
      }
    } else if (type === 'maintenance') {
      const nextStatus = item.status === 'Pending' ? 'Completed' : 'Pending';
      if (onEditMaintenanceEntry) {
        onEditMaintenanceEntry({
          ...item,
          status: nextStatus
        });
      }
    }
  };

  const handleDownload = () => {
    if (!type || !item) return;

    let textContent = '';
    if (isFuel) {
      textContent = `
=========================================
      VISION FOOD & PACKAGING LAHORE
             OFFICIAL RECEIPT
=========================================
Receipt ID:  ${serialNo}
Date:        ${isArray ? firstEntry?.date : item.date}
Type:        FUEL EXPENSES VOUCHER
Status:      ${isPending ? 'PENDING / UNPAID' : 'PAID / CLEARED'}
-----------------------------------------
Company Name: Vision Food & Packaging
Department:   ${vehicle?.department || 'General'}
-----------------------------------------
`;
      if (isArray) {
        textContent += `Vehicles in Batch: ${fuelEntriesList.length}\n`;
        fuelEntriesList.forEach((e, idx) => {
          const v = vehicles.find(veh => veh.id === e.vehicleId);
          const d = drivers.find(drv => drv.id === e.driverId);
          textContent += `\n[Entry ${idx + 1}]
Date:       ${e.date}
Vehicle:    ${v?.vehicleNo || 'N/A'} (${v?.modelName || 'N/A'})
Driver:     ${d?.name || 'N/A'}
Litres:     ${Number(e.litres).toFixed(2)} L
Rate:       PKR ${Number(e.ratePerLitre).toFixed(2)}/L
Amount:     PKR ${Number(e.totalAmount).toLocaleString()}
Odometer:   ${Number(e.odometerReading).toLocaleString()} KM
Pump Name:  ${e.pumpName || 'N/A'}
-----------------------------------------`;
        });
      } else {
        textContent += `Vehicle No:  ${vehicle?.vehicleNo || 'N/A'} (${vehicle?.modelName || 'N/A'})
Driver/Rider:${driver?.name || 'N/A'}
Pump Name:   ${firstEntry?.pumpName || 'N/A'}
Litres:      ${Number(firstEntry?.litres).toFixed(2)} L
Rate:        PKR ${Number(firstEntry?.ratePerLitre).toFixed(2)}/L
Odometer:    ${Number(firstEntry?.odometerReading).toLocaleString()} KM
-----------------------------------------`;
      }
      textContent += `\nTOTAL AMOUNT: PKR ${totalSum.toLocaleString()}
=========================================
        SAFE INSIDE - SUNDAR LAHORE
=========================================
`;
    } else {
      textContent = `
=========================================
      VISION FOOD & PACKAGING LAHORE
             OFFICIAL RECEIPT
=========================================
Receipt ID:  ${serialNo}
Date:        ${item.date}
Type:        MAINTENANCE EXPENSES VOUCHER
Status:      ${isPending ? 'PENDING / UNPAID' : 'PAID / CLEARED'}
-----------------------------------------
Vehicle No:  ${vehicle?.vehicleNo || 'N/A'} (${vehicle?.modelName || 'N/A'})
Driver/Rider:${driver?.name || 'Workshop Job'}
Workshop:    ${item.workshopName || 'N/A'}
Type:        ${item.maintenanceType || 'N/A'}
Address:     ${item.vendorAddress || 'N/A'}
Odometer:    ${item.currentReading ? `${Number(item.currentReading).toLocaleString()} KM` : 'N/A'}
-----------------------------------------
Breakdown / Details:
Parts Cost:  PKR ${Number(item.partsCost).toLocaleString()}
Labor Cost:  PKR ${Number(item.laborCost).toLocaleString()}
Notes:       ${item.notes || 'None'}
Next Service: ${item.nextReading ? `${Number(item.nextReading).toLocaleString()} KM` : 'N/A'}
-----------------------------------------
TOTAL COST:   PKR ${Number(item.totalCost).toLocaleString()}
=========================================
        SAFE INSIDE - SUNDAR LAHORE
=========================================
`;
    }

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${type}_${serialNo}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
                  <p><span className="font-semibold text-slate-500">Date Generated:</span> <span className="font-bold text-slate-900">{isArray ? firstEntry?.date : item.date}</span></p>
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
                <span>{isFuel ? (isArray ? `Fuel Expenses Voucher (Batch of ${fuelEntriesList.length} Vehicles)` : 'Fuel Expenses Voucher') : 'Maintenance Expenses Voucher'}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Payment Status:</span>
                <span className={`font-bold ${isPending ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isPending ? 'UNPAID / PENDING' : 'PAID / CLEARED'}
                </span>
              </p>
              {driver && !isArray && (
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
                      {fuelEntriesList.map((entry, idx) => {
                        const entryVehicle = vehicles.find((v) => v.id === entry.vehicleId);
                        const entryDriver = drivers.find((d) => d.id === entry.driverId) || (entryVehicle ? drivers.find((d) => d.id === entryVehicle.assignedDriverId) : null);
                        const entryFuelType = getFuelType(entryVehicle);
                        
                        return (
                          <tr key={entry.id || idx} className="bg-white">
                            <td className="py-3.5 px-4 font-medium border-r border-slate-200 font-mono text-xs">{entry.date}</td>
                            <td className="py-3.5 px-4 font-bold text-[#154294] border-r border-slate-200 font-sans text-xs">
                              <div>{entryVehicle?.vehicleNo || 'N/A'}</div>
                              {entryDriver && <div className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">{entryDriver.name}</div>}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-600 border-r border-slate-200 uppercase font-sans text-xs">
                              <div>{entry.pumpName || 'N/A'}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{entryFuelType}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold border-r border-slate-200 font-mono text-xs">{Number(entry.litres).toFixed(2)}</td>
                            <td className="py-3.5 px-4 text-right font-mono border-r border-slate-200 text-xs">{Number(entry.ratePerLitre).toFixed(2)}</td>
                            <td className="py-3.5 px-4 text-right font-bold text-[#154294] font-mono text-xs">PKR {Number(entry.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                      {/* Total row */}
                      <tr className="bg-white font-bold border-t border-slate-200">
                        <td colSpan={4} className="py-3.5 px-4 border-r border-slate-200"></td>
                        <td className="py-3.5 px-4 text-right uppercase tracking-wider text-slate-900 text-[10px] font-sans font-bold border-r border-slate-200">GRAND TOTAL</td>
                        <td className="py-3.5 px-4 text-right text-[#154294] font-black font-mono text-xs">
                          PKR {totalSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                {isPending ? (
                  <div className="border-[3px] border-double border-rose-500 text-rose-500 font-mono font-black text-sm uppercase tracking-widest px-6 py-1.5 rounded rotate-[5deg] bg-white select-none pointer-events-none shadow-sm">
                    UNPAID
                  </div>
                ) : (
                  <div className="border-[3px] border-double border-[#059669] text-[#059669] font-mono font-black text-sm uppercase tracking-widest px-6 py-1.5 rounded rotate-[5deg] bg-white select-none pointer-events-none shadow-sm">
                    PAID
                  </div>
                )}
              </div>
            </div>

            {/* Extra details for validation (e.g. Odometer / Pump or Next Service) */}
            <div className="mt-2 grid grid-cols-2 gap-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3 font-mono">
              {isFuel ? (
                <>
                  <p>
                    <span className="font-bold uppercase">Filling Pump Station:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {isArray ? `${fuelEntriesList.length} Vehicles (Batch)` : firstEntry?.pumpName}
                    </span>
                  </p>
                  <p className="text-right">
                    <span className="font-bold uppercase">Total Litres:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {fuelEntriesList.reduce((sum, e) => sum + e.litres, 0).toFixed(2)} L
                    </span>
                  </p>
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
        <div className="px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
          
          <div className="flex items-center gap-2.5">
            {/* Toggle Status Button (Paid / Unpaid) */}
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 ${
                isPending
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isPending ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as Paid</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Mark as Unpaid (Pending)</span>
                </>
              )}
            </button>

            {/* Download Text Bill */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Receipt</span>
            </button>

            {/* Print Voucher */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold bg-[#154294] hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-900/25 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
          </div>
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
          .text-rose-500 {
            color: #f43f5e !important;
          }
          .border-rose-500 {
            border-color: #f43f5e !important;
          }
          .text-rose-600 {
            color: #e11d48 !important;
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
