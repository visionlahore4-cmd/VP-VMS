import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Bike,
  Users, 
  Key, 
  Fuel, 
  Wrench, 
  FileText, 
  Database,
  X,
  Gauge,
  Receipt,
  LogOut,
  Lock
} from 'lucide-react';
import { VisionPackagingLogo } from './VisionPackagingLogo';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  onPortalLogout?: () => void;
  onAdminLoginTrigger?: () => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange, 
  isOpen, 
  onToggle, 
  onLogout, 
  onPortalLogout,
  onAdminLoginTrigger, 
  isAdmin 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'bikes', label: 'Bikes / Motorcycles', icon: Bike },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'allotments', label: 'Allotments', icon: Key },
    { id: 'fuel', label: 'Fuel Management', icon: Fuel },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tokentax', label: 'Token Tax & E-Tag', icon: FileText },
    { id: 'bills', label: 'Bills & Invoices', icon: Receipt },
    ...(isAdmin ? [{ id: 'database', label: 'Data & Backup', icon: Database }] : []),
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-all duration-300 no-print"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-[#1e293b]/40 backdrop-blur-md p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:w-72 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* App Brand / Header */}
          <div className="flex items-center justify-between">
            <VisionPackagingLogo layout="horizontal" size="sm" showText={true} light={false} />
            
            {/* Close Button for Mobile */}
            <button 
              onClick={onToggle}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 lg:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Fleet Modules</span>
            
            <div className="mt-2 space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (isOpen) onToggle();
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-400 font-semibold' 
                        : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? 'scale-110 text-emerald-400 opacity-100' : 'text-slate-400 opacity-60'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-slate-900/60 space-y-3.5">
          {isAdmin ? (
            onLogout && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to exit Admin Mode? This will lock modification access.')) {
                    onLogout();
                  }
                }}
                className="w-full flex items-center gap-4 px-4 py-2.5 rounded-md text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/10 cursor-pointer transition-all"
              >
                <LogOut className="w-4 h-4 opacity-70" />
                <span>Exit Admin Mode</span>
              </button>
            )
          ) : (
            onAdminLoginTrigger && (
              <button
                onClick={onAdminLoginTrigger}
                className="w-full flex items-center gap-4 px-4 py-2.5 rounded-md text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20 border border-transparent hover:border-emerald-500/10 cursor-pointer transition-all animate-pulse"
              >
                <Lock className="w-4 h-4 opacity-70" />
                <span>Admin Login</span>
              </button>
            )
          )}

          {onPortalLogout && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of the portal? This will lock the application.')) {
                  onPortalLogout();
                }
              }}
              className="w-full flex items-center gap-4 px-4 py-2 bg-slate-950/50 hover:bg-slate-950/80 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-300 border border-slate-800/60 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4 opacity-50" />
              <span>Sign Out of Portal</span>
            </button>
          )}

          <div className="text-center">
            <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">Local Persistence Active</span>
            </div>
            <p className="text-[9px] text-slate-600 mt-0.5 font-sans">© 2026 Vehicle Management Hub</p>
          </div>
        </div>
      </aside>
    </>
  );
};
