import React, { useRef, useState } from 'react';
import { AppState } from '../types';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Info,
  Shield,
  Eye,
  EyeOff,
  Save,
  LogOut
} from 'lucide-react';

interface DataManagementTabProps {
  state: AppState;
  onImportState: (importedState: AppState) => void;
  onResetState: () => void;
  onRestoreBackup: () => void;
  hasBackup: boolean;
  addToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
  onLogout?: () => void;
}

export const DataManagementTab: React.FC<DataManagementTabProps> = ({
  state,
  onImportState,
  onResetState,
  onRestoreBackup,
  hasBackup,
  addToast,
  onLogout
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Credentials Editing State
  const [currentUsername, setCurrentUsername] = useState(localStorage.getItem('portal_username') || 'admin');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSecPassword, setShowSecPassword] = useState(false);

  // User (View-Only) Credentials Editing State
  const [currentUserUsername, setCurrentUserUsername] = useState(localStorage.getItem('portal_user_username') || 'user');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmUserPassword, setConfirmUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() && !newPassword.trim()) {
      if (addToast) addToast('Please fill in a new admin username or password to update.', 'error');
      else alert('Please fill in a new admin username or password to update.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      if (addToast) addToast('Admin passwords do not match. Please verify confirmation field.', 'error');
      else alert('Admin passwords do not match. Please verify confirmation field.');
      return;
    }

    if (newUsername.trim()) {
      localStorage.setItem('portal_username', newUsername.trim().toLowerCase());
      setCurrentUsername(newUsername.trim().toLowerCase());
    }
    if (newPassword) {
      localStorage.setItem('portal_password', newPassword);
    }

    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');

    if (addToast) addToast('Admin security credentials updated successfully!', 'success');
    else alert('Admin security credentials updated successfully!');
  };

  const handleUpdateUserCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUsername.trim() && !newUserPassword.trim()) {
      if (addToast) addToast('Please fill in a new user username or password to update.', 'error');
      else alert('Please fill in a new user username or password to update.');
      return;
    }

    if (newUserPassword && newUserPassword !== confirmUserPassword) {
      if (addToast) addToast('User passwords do not match. Please verify confirmation field.', 'error');
      else alert('User passwords do not match. Please verify confirmation field.');
      return;
    }

    if (newUserUsername.trim()) {
      localStorage.setItem('portal_user_username', newUserUsername.trim().toLowerCase());
      setCurrentUserUsername(newUserUsername.trim().toLowerCase());
    }
    if (newUserPassword) {
      localStorage.setItem('portal_user_password', newUserPassword);
    }

    setNewUserUsername('');
    setNewUserPassword('');
    setConfirmUserPassword('');

    if (addToast) addToast('User security credentials updated successfully!', 'success');
    else alert('User security credentials updated successfully!');
  };

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

      {/* Administrative Security Settings Card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <h3 className="font-display font-bold text-slate-200 text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Portal Authentication Settings
          </h3>
          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of the portal?')) {
                  onLogout();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>

        {/* SECTION 1: ADMIN CREDENTIALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Credentials (Full Write & Manage Access)
            </span>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure secure login credentials for administrative access. The default username is <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono">admin</code> and the default password is <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono">admin123</code>.
          </p>

          <form onSubmit={handleUpdateCredentials} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* New Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                New Admin Username (Current: <span className="text-indigo-400 font-mono lowercase">{currentUsername}</span>)
              </label>
              <input
                type="text"
                placeholder="e.g. admin"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                New Admin Password
              </label>
              <div className="relative">
                <input
                  type={showSecPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSecPassword(!showSecPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showSecPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password & Save Button */}
            <div className="space-y-1.5 flex gap-3">
              <div className="flex-grow space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Confirm Admin Password
                </label>
                <input
                  type={showSecPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap self-end h-[41px]"
              >
                <Save className="w-3.5 h-3.5" /> Update Admin
              </button>
            </div>
          </form>
        </div>

        <hr className="border-slate-800/40" />

        {/* SECTION 2: USER CREDENTIALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Standard User Credentials (View Only Access)
            </span>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure secure login credentials for standard view-only access. The default username is <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400 font-mono">user</code> and the default password is <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400 font-mono">user123</code>.
          </p>

          <form onSubmit={handleUpdateUserCredentials} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* New User Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                New User Username (Current: <span className="text-blue-400 font-mono lowercase">{currentUserUsername}</span>)
              </label>
              <input
                type="text"
                placeholder="e.g. user"
                value={newUserUsername}
                onChange={(e) => setNewUserUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
              />
            </div>

            {/* New User Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                New User Password
              </label>
              <div className="relative">
                <input
                  type={showUserPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowUserPassword(!showUserPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showUserPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm User Password & Save Button */}
            <div className="space-y-1.5 flex gap-3">
              <div className="flex-grow space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Confirm User Password
                </label>
                <input
                  type={showUserPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmUserPassword}
                  onChange={(e) => setConfirmUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/60 text-slate-200 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs outline-none transition-all placeholder-slate-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap self-end h-[41px]"
              >
                <Save className="w-3.5 h-3.5" /> Update User
              </button>
            </div>
          </form>
        </div>

        {/* Separator and Reset Credentials */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-300 block">Emergency Default Credential Recovery</span>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Reset your credentials back to their pristine factory settings.
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset Admin credentials back to default? (admin / admin123)')) {
                  localStorage.removeItem('portal_username');
                  localStorage.removeItem('portal_password');
                  setCurrentUsername('admin');
                  if (addToast) addToast('Admin credentials have been reset to admin / admin123.', 'success');
                }
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Reset Admin Default
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset User credentials back to default? (user / user123)')) {
                  localStorage.removeItem('portal_user_username');
                  localStorage.removeItem('portal_user_password');
                  setCurrentUserUsername('user');
                  if (addToast) addToast('User credentials have been reset to user / user123.', 'success');
                }
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Reset User Default
            </button>
          </div>
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
