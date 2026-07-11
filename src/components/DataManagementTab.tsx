import React, { useRef } from 'react';
import { AppState } from '../types';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Info 
} from 'lucide-react';

interface DataManagementTabProps {
  state: AppState;
  onImportState: (importedState: AppState) => void;
  onResetState: () => void;
  onRestoreBackup: () => void;
  hasBackup: boolean;
}

export const DataManagementTab: React.FC<DataManagementTabProps> = ({
  state,
  onImportState,
  onResetState,
  onRestoreBackup,
  hasBackup
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export entire localStorage state as dynamic JSON file download
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `vm_hub_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      alert('Failed to export database. Please check console logs.');
      console.error(error);
    }
  };

  // 2. Import JSON file and update App state
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsedState = JSON.parse(event.target?.result as string);
        
        // Simple validation checks to ensure JSON is a valid AppState
        if (
          parsedState && 
          Array.isArray(parsedState.vehicles) && 
          Array.isArray(parsedState.drivers) && 
          Array.isArray(parsedState.fuelEntries) && 
          Array.isArray(parsedState.maintenanceEntries)
        ) {
          if (window.confirm('Are you absolutely sure you want to import this file? It will OVERWRITE all current vehicles, drivers, allotments, and transaction logs.')) {
            onImportState(parsedState as AppState);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        } else {
          alert('Invalid Backup File format. Please upload a valid JSON exported from this application.');
        }
      } catch (error) {
        alert('Failed to read or parse file. Please verify the JSON code is correct.');
        console.error(error);
      }
    };
    
    fileReader.readAsText(files[0]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-400" /> Administrative Data & Security Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Secure, backup, and restore your local vehicle ledger. All operations compile instantly on local sandbox sandboxes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export & Import Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-slate-200 text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" /> Database Backup & Transfer
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download your entire company database (containing all registered vehicles, operational drivers, departments, fuel metrics, and maintenance files) as a standalone portable <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono">.json</code> file.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Export */}
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 font-semibold text-xs cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export JSON Database
            </button>

            {/* Import */}
            <button
              onClick={triggerFileInput}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 font-semibold text-xs cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4 text-emerald-400" /> Import JSON Database
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
          <span className="text-[10px] text-slate-500 block text-center">Caution: Importing files overwrites current runtime session files.</span>
        </div>

        {/* Hidden Auto-Backup Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-slate-200 text-base flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-400" /> Hidden Auto-Backup Engine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every time changes are made, the hub stores a secure snapshot in local space. If the vehicle index drops to 0 (accidental data wipes or cache purges), <strong className="text-slate-300">the hidden backup will NOT be overwritten</strong>, letting you recover with one click.
          </p>

          {hasBackup ? (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Auto-Backup Intact</span>
                <span className="text-[10px] text-slate-500">Secure snapshot storage contains active telemetry records.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <Info className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">No Active Auto-Backup</span>
                <span className="text-[10px] text-slate-500">Backup is compiled on your first record insertion.</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (window.confirm('Restore database from the hidden auto-backup snapshot? Current modifications since last auto-save will be reverted.')) {
                onRestoreBackup();
              }
            }}
            disabled={!hasBackup}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-orange-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" /> Restore Hidden Auto-Backup
          </button>
        </div>

      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-4">
        <h3 className="font-display font-bold text-orange-400 text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Resetting the database wipes out all current vehicle listings, registered drivers, active department allotments, fuel telemetry receipts, and workshop records from localStorage.
        </p>

        <button
          onClick={() => {
            const firstCheck = window.confirm('WARNING: Are you sure you want to reset the database? This action will restore empty state but you can still use the Restore Auto-Backup to recover if you have a backup.');
            if (firstCheck) {
              const secondCheck = window.prompt('Type "RESET" to confirm permanent purge:');
              if (secondCheck === 'RESET' || secondCheck === 'reset') {
                onResetState();
              } else {
                alert('Purge aborted. Confirmation keyword did not match.');
              }
            }
          }}
          className="px-5 py-2.5 bg-slate-900 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 rounded-xl border border-slate-800 hover:border-orange-500/30 text-xs font-semibold cursor-pointer transition-all"
        >
          Factory Reset Database
        </button>
      </div>

    </div>
  );
};
