import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Key, 
  Fuel, 
  Wrench, 
  FileText, 
  Database,
  X,
  Gauge
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isOpen, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'allotments', label: 'Allotments', icon: Key },
    { id: 'fuel', label: 'Fuel Management', icon: Fuel },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tokentax', label: 'Token Tax & E-Tag', icon: FileText },
    { id: 'database', label: 'Data & Backup', icon: Database },
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-white tracking-tight leading-none">
                  VP <span className="text-emerald-400">VMS</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500/80">Vehicle Management</span>
              </div>
            </div>
            
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

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-900/60 text-center">
          <div className="flex justify-center items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono">Local Persistence Active</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-sans">© 2026 Vehicle Management Hub</p>
        </div>
      </aside>
    </>
  );
};
