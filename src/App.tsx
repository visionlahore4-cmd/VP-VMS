import { useState, useEffect } from 'react';
import { AppState, Vehicle, Driver, Allotment, FuelEntry, MaintenanceEntry, TokenTaxEntry } from './types';
import { 
  DEMO_DRIVERS, 
  DEMO_VEHICLES, 
  DEMO_ALLOTMENTS, 
  DEMO_FUEL_ENTRIES, 
  DEMO_MAINTENANCE_ENTRIES, 
  DEMO_TOKEN_TAX_ENTRIES 
} from './demoData';

// Subcomponents
import { Sidebar } from './components/Sidebar';
import { Toast, useToasts } from './components/Toast';
import { DashboardTab } from './components/DashboardTab';
import { VehiclesTab } from './components/VehiclesTab';
import { DriversTab } from './components/DriversTab';
import { AllotmentsTab } from './components/AllotmentsTab';
import { FuelTab } from './components/FuelTab';
import { MaintenanceTab } from './components/MaintenanceTab';
import { TokenTaxTab } from './components/TokenTaxTab';
import { DataManagementTab } from './components/DataManagementTab';
import { BikesTab } from './components/BikesTab';
import { BillsTab } from './components/BillsTab';
import { InvoiceModal } from './components/InvoiceModal';

import { Menu, User, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vh_hub_state';
const BACKUP_STORAGE_KEY = 'vh_hub_backup_state';

const defaultEmptyState: AppState = {
  vehicles: [],
  drivers: [],
  allotments: [],
  fuelEntries: [],
  maintenanceEntries: [],
  tokenTaxEntries: []
};

export default function App() {
  const [state, setState] = useState<AppState>(defaultEmptyState);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [hasBackup, setHasBackup] = useState<boolean>(false);

  // Invoice / Receipt slip viewer state
  const [activeInvoiceType, setActiveInvoiceType] = useState<'fuel' | 'maintenance' | null>(null);
  const [activeInvoiceItem, setActiveInvoiceItem] = useState<any>(null);

  const { toasts, addToast, removeToast } = useToasts();

  // 1. Initial Load & Seed Population
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      const backupState = localStorage.getItem(BACKUP_STORAGE_KEY);

      if (backupState) {
        setHasBackup(true);
      }

      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.vehicles && parsed.vehicles.length < 10) {
          const seededState: AppState = {
            vehicles: DEMO_VEHICLES,
            drivers: DEMO_DRIVERS,
            allotments: DEMO_ALLOTMENTS,
            fuelEntries: DEMO_FUEL_ENTRIES,
            maintenanceEntries: DEMO_MAINTENANCE_ENTRIES,
            tokenTaxEntries: DEMO_TOKEN_TAX_ENTRIES
          };
          setState(seededState);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seededState));
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(seededState));
          setHasBackup(true);
          addToast('Upgraded database with the complete 25-vehicle real roster!', 'success');
        } else {
          setState(parsed);
        }
      } else {
        // First load: seed with realistic default company demo datasets
        const seededState: AppState = {
          vehicles: DEMO_VEHICLES,
          drivers: DEMO_DRIVERS,
          allotments: DEMO_ALLOTMENTS,
          fuelEntries: DEMO_FUEL_ENTRIES,
          maintenanceEntries: DEMO_MAINTENANCE_ENTRIES,
          tokenTaxEntries: DEMO_TOKEN_TAX_ENTRIES
        };
        setState(seededState);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seededState));
        // Also save to hidden auto-backup space
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(seededState));
        setHasBackup(true);
        addToast('Welcome! Seeded demo company fleet records for testing.', 'info');
      }
    } catch (e) {
      console.error('Failed to load local database state:', e);
      addToast('Critical: Database load error. Reverting to empty.', 'error');
    }
  }, []);

  // 2. Custom Safe-Write state wrapper
  const updateAndSaveState = (newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      
      // Auto-Backup Logic:
      // If vehicle list count is greater than 0, write hidden backup snapshot.
      // If count suddenly drops to 0 (accidental wipe), DO NOT overwrite backup snapshot!
      if (newState.vehicles.length > 0) {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(newState));
        setHasBackup(true);
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      addToast('Storage quota exceeded. Re-check file attachments.', 'error');
    }
  };

  // --- VEHICLE HANDLERS ---
  const handleAddVehicle = (newVeh: Omit<Vehicle, 'id'>) => {
    const id = `veh-${Math.random().toString(36).substring(2, 9)}`;
    const added: Vehicle = { ...newVeh, id };
    const nextState = { ...state, vehicles: [...state.vehicles, added] };
    updateAndSaveState(nextState);
    addToast(`Registered vehicle ${added.vehicleNo} successfully!`, 'success');
  };

  const handleEditVehicle = (updatedVeh: Vehicle) => {
    const nextState = {
      ...state,
      vehicles: state.vehicles.map(v => v.id === updatedVeh.id ? updatedVeh : v)
    };
    updateAndSaveState(nextState);
    addToast(`Updated specifications for vehicle ${updatedVeh.vehicleNo}.`, 'success');
  };

  const handleDeleteVehicle = (id: string) => {
    const target = state.vehicles.find(v => v.id === id);
    const nextState = {
      ...state,
      vehicles: state.vehicles.filter(v => v.id !== id),
      // Clean cascade: revoke associated allotments
      allotments: state.allotments.filter(a => a.vehicleId !== id)
    };
    updateAndSaveState(nextState);
    addToast(`Removed vehicle ${target?.vehicleNo || ''} from active inventory.`, 'success');
  };

  // --- DRIVER HANDLERS ---
  const handleAddDriver = (newDrv: Omit<Driver, 'id'>) => {
    const id = `drv-${Math.random().toString(36).substring(2, 9)}`;
    const added: Driver = { ...newDrv, id };
    const nextState = { ...state, drivers: [...state.drivers, added] };
    updateAndSaveState(nextState);
    addToast(`Registered new driver: ${added.name}.`, 'success');
  };

  const handleEditDriver = (updatedDrv: Driver) => {
    const nextState = {
      ...state,
      drivers: state.drivers.map(d => d.id === updatedDrv.id ? updatedDrv : d)
    };
    updateAndSaveState(nextState);
    addToast(`Modified profile for driver: ${updatedDrv.name}.`, 'success');
  };

  const handleDeleteDriver = (id: string) => {
    const target = state.drivers.find(d => d.id === id);
    const nextState = {
      ...state,
      drivers: state.drivers.filter(d => d.id !== id),
      // Clean cascade: revoke allotments
      allotments: state.allotments.filter(a => a.driverId !== id)
    };
    updateAndSaveState(nextState);
    addToast(`Removed driver: ${target?.name || ''} from directory.`, 'success');
  };

  // --- ALLOTMENT HANDLERS ---
  const handleAddAllotment = (newAlt: Omit<Allotment, 'id'>) => {
    const id = `alt-${Math.random().toString(36).substring(2, 9)}`;
    const added: Allotment = { ...newAlt, id };
    const nextState = { ...state, allotments: [...state.allotments, added] };
    updateAndSaveState(nextState);
    
    const v = state.vehicles.find(veh => veh.id === added.vehicleId);
    const d = state.drivers.find(drv => drv.id === added.driverId);
    addToast(`Issued vehicle ${v?.vehicleNo || ''} to driver ${d?.name || ''} in ${added.department}.`, 'success');
  };

  const handleEditAllotment = (updatedAlt: Allotment) => {
    const nextState = {
      ...state,
      allotments: state.allotments.map(a => a.id === updatedAlt.id ? updatedAlt : a)
    };
    updateAndSaveState(nextState);
    addToast('Modified active allotment dispatch order.', 'success');
  };

  const handleDeleteAllotment = (id: string) => {
    const nextState = {
      ...state,
      allotments: state.allotments.filter(a => a.id !== id)
    };
    updateAndSaveState(nextState);
    addToast('Revoked vehicle department allotment order.', 'success');
  };

  // --- FUEL LEDGER HANDLERS ---
  const handleAddFuelEntry = (newFuel: Omit<FuelEntry, 'id'>) => {
    const id = `fuel-${Math.random().toString(36).substring(2, 9)}`;
    const added: FuelEntry = { ...newFuel, id };
    const nextState = { ...state, fuelEntries: [...state.fuelEntries, added] };
    updateAndSaveState(nextState);
    addToast(`Logged refuel: PKR ${added.totalAmount.toLocaleString()} saved.`, 'success');
  };

  const handleAddFuelEntries = (newFuels: Omit<FuelEntry, 'id'>[]) => {
    const addedEntries = newFuels.map(f => ({
      ...f,
      id: `fuel-${Math.random().toString(36).substring(2, 9)}`
    }));
    const nextState = { ...state, fuelEntries: [...state.fuelEntries, ...addedEntries] };
    updateAndSaveState(nextState);
    const totalSum = addedEntries.reduce((sum, e) => sum + e.totalAmount, 0);
    addToast(`Logged ${addedEntries.length} refuel slips: Total PKR ${totalSum.toLocaleString()} saved.`, 'success');
  };

  const handleEditFuelEntry = (updatedFuel: FuelEntry) => {
    const nextState = {
      ...state,
      fuelEntries: state.fuelEntries.map(f => f.id === updatedFuel.id ? updatedFuel : f)
    };
    updateAndSaveState(nextState);
    addToast('Modified fuel log entries.', 'success');
  };

  const handleDeleteFuelEntry = (id: string) => {
    const nextState = {
      ...state,
      fuelEntries: state.fuelEntries.filter(f => f.id !== id)
    };
    updateAndSaveState(nextState);
    addToast('Permanently deleted fuel log entry.', 'success');
  };

  // --- MAINTENANCE LEDGER HANDLERS ---
  const handleAddMaintenanceEntry = (newMaint: Omit<MaintenanceEntry, 'id'>) => {
    const id = `maint-${Math.random().toString(36).substring(2, 9)}`;
    const added: MaintenanceEntry = { ...newMaint, id };
    const nextState = { ...state, maintenanceEntries: [...state.maintenanceEntries, added] };
    updateAndSaveState(nextState);
    addToast(`Recorded workshop bill: PKR ${added.totalCost.toLocaleString()}`, 'success');
  };

  const handleEditMaintenanceEntry = (updatedMaint: MaintenanceEntry) => {
    const nextState = {
      ...state,
      maintenanceEntries: state.maintenanceEntries.map(m => m.id === updatedMaint.id ? updatedMaint : m)
    };
    updateAndSaveState(nextState);
    addToast('Updated workshop ledger record.', 'success');
  };

  const handleDeleteMaintenanceEntry = (id: string) => {
    const nextState = {
      ...state,
      maintenanceEntries: state.maintenanceEntries.filter(m => m.id !== id)
    };
    updateAndSaveState(nextState);
    addToast('Removed workshop ledger record.', 'success');
  };

  // --- TOKEN TAX LEDGER HANDLERS ---
  const handleAddTokenTaxEntry = (newTax: Omit<TokenTaxEntry, 'id'>) => {
    const id = `tax-${Math.random().toString(36).substring(2, 9)}`;
    const added: TokenTaxEntry = { ...newTax, id };
    const nextState = { ...state, tokenTaxEntries: [...state.tokenTaxEntries, added] };
    updateAndSaveState(nextState);
    addToast('Logged excise tax token filing successfully.', 'success');
  };

  const handleEditTokenTaxEntry = (updatedTax: TokenTaxEntry) => {
    const nextState = {
      ...state,
      tokenTaxEntries: state.tokenTaxEntries.map(t => t.id === updatedTax.id ? updatedTax : t)
    };
    updateAndSaveState(nextState);
    addToast('Modified annual tax token regulatory log.', 'success');
  };

  const handleDeleteTokenTaxEntry = (id: string) => {
    const nextState = {
      ...state,
      tokenTaxEntries: state.tokenTaxEntries.filter(t => t.id !== id)
    };
    updateAndSaveState(nextState);
    addToast('Purged annual tax token record.', 'success');
  };

  // --- ADMINISTRATION & DATA MANAGEMENT HANDLERS ---
  const handleImportState = (importedState: AppState) => {
    updateAndSaveState(importedState);
    addToast('Database backup loaded and restored successfully.', 'success');
  };

  const handleResetState = () => {
    // Reset back to empty but keep hidden backup
    setState(defaultEmptyState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultEmptyState));
    addToast('Database wiped out. Reverted to raw factory empty values.', 'info');
  };

  const handleRestoreBackup = () => {
    const rawBackup = localStorage.getItem(BACKUP_STORAGE_KEY);
    if (rawBackup) {
      try {
        const parsed = JSON.parse(rawBackup);
        setState(parsed);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        addToast('Reclaimed system databases from hidden auto-backup.', 'success');
      } catch (e) {
        addToast('Backup corrupted. Factory reset recommended.', 'error');
      }
    } else {
      addToast('No auto-saved snapshot was recovered on this local storage.', 'error');
    }
  };

  // Trigger Receipt view
  const handleViewInvoice = (type: 'fuel' | 'maintenance', item: any) => {
    setActiveInvoiceType(type);
    setActiveInvoiceItem(item);
  };

  // Helper to retrieve allotment matching the current view if necessary
  const allotmentsMappedForVehicles = state.allotments.map(alt => ({
    vehicleId: alt.vehicleId,
    department: alt.department
  }));

  const allotmentsMappedForDrivers = state.allotments.map(alt => ({
    driverId: alt.driverId,
    vehicleId: alt.vehicleId
  }));

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-sans select-none antialiased overflow-x-hidden">
      
      {/* Toast Alert stack overlay */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Sidebar navigation element */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main workspace container */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top bar header */}
        <header className="h-20 border-b border-slate-800 px-6 md:px-8 flex items-center justify-between bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-30 no-print">
          
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/50 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Active Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User profile identifier bar */}
            <div className="flex items-center gap-2.5 bg-slate-900/50 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-200 block leading-tight">Admin Terminal</span>
                <span className="text-[9px] text-slate-500 block">Head Office LHR</span>
              </div>
            </div>
          </div>

        </header>

        {/* Tab pages controller */}
        <div className="p-6 md:p-8 flex-grow">
          {currentTab === 'dashboard' && (
            <DashboardTab 
              state={state} 
              onNavigate={(tab) => setCurrentTab(tab)} 
            />
          )}

          {currentTab === 'vehicles' && (
            <VehiclesTab
              vehicles={state.vehicles}
              drivers={state.drivers}
              allotments={allotmentsMappedForVehicles}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          )}

          {currentTab === 'bikes' && (
            <BikesTab
              vehicles={state.vehicles}
              drivers={state.drivers}
              allotments={state.allotments}
              onAddBike={handleAddVehicle}
              onEditBike={handleEditVehicle}
              onDeleteBike={handleDeleteVehicle}
            />
          )}

          {currentTab === 'drivers' && (
            <DriversTab
              drivers={state.drivers}
              allotments={allotmentsMappedForDrivers}
              vehicles={state.vehicles.map(v => ({ id: v.id, vehicleNo: v.vehicleNo }))}
              onAddDriver={handleAddDriver}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
            />
          )}

          {currentTab === 'allotments' && (
            <AllotmentsTab
              allotments={state.allotments}
              vehicles={state.vehicles}
              drivers={state.drivers}
              onAddAllotment={handleAddAllotment}
              onEditAllotment={handleEditAllotment}
              onDeleteAllotment={handleDeleteAllotment}
            />
          )}

          {currentTab === 'fuel' && (
            <FuelTab
              fuelEntries={state.fuelEntries}
              vehicles={state.vehicles}
              drivers={state.drivers}
              allotments={state.allotments}
              onAddFuelEntry={handleAddFuelEntry}
              onAddFuelEntries={handleAddFuelEntries}
              onEditFuelEntry={handleEditFuelEntry}
              onDeleteFuelEntry={handleDeleteFuelEntry}
              onViewInvoice={handleViewInvoice}
            />
          )}

          {currentTab === 'maintenance' && (
            <MaintenanceTab
              maintenanceEntries={state.maintenanceEntries}
              vehicles={state.vehicles}
              drivers={state.drivers}
              onAddMaintenanceEntry={handleAddMaintenanceEntry}
              onEditMaintenanceEntry={handleEditMaintenanceEntry}
              onDeleteMaintenanceEntry={handleDeleteMaintenanceEntry}
              onViewInvoice={handleViewInvoice}
            />
          )}

          {currentTab === 'tokentax' && (
            <TokenTaxTab
              tokenTaxEntries={state.tokenTaxEntries}
              vehicles={state.vehicles}
              drivers={state.drivers}
              onAddTokenTaxEntry={handleAddTokenTaxEntry}
              onEditTokenTaxEntry={handleEditTokenTaxEntry}
              onDeleteTokenTaxEntry={handleDeleteTokenTaxEntry}
            />
          )}

          {currentTab === 'bills' && (
            <BillsTab
              fuelEntries={state.fuelEntries}
              maintenanceEntries={state.maintenanceEntries}
              vehicles={state.vehicles}
              drivers={state.drivers}
              onEditFuelEntry={handleEditFuelEntry}
              onEditMaintenanceEntry={handleEditMaintenanceEntry}
              onViewInvoice={handleViewInvoice}
            />
          )}

          {currentTab === 'database' && (
            <DataManagementTab
              state={state}
              onImportState={handleImportState}
              onResetState={handleResetState}
              onRestoreBackup={handleRestoreBackup}
              hasBackup={hasBackup}
            />
          )}
        </div>

      </main>

      {/* Official Voucher Printable Invoice dialog modal overlay */}
      <InvoiceModal
        type={activeInvoiceType}
        item={activeInvoiceItem}
        vehicles={state.vehicles}
        drivers={state.drivers}
        onClose={() => {
          setActiveInvoiceType(null);
          setActiveInvoiceItem(null);
        }}
      />

      {/* Floating System Status Badge */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl shadow-emerald-500/40 transform scale-90 border border-white/20 z-40 no-print">
        <span className="text-sm font-bold">System Status: Optimal</span>
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
      </div>

    </div>
  );
}
