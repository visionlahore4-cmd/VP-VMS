import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full no-print">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl border glass-panel shadow-lg transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4 ${
              isSuccess 
                ? 'border-emerald-500/30 text-emerald-400 glow-emerald' 
                : isError 
                  ? 'border-orange-500/30 text-orange-400 glow-orange' 
                  : 'border-slate-500/30 text-slate-300'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {isError && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 flex-shrink-0" />}
            
            <p className="text-sm font-medium text-slate-200 flex-grow leading-tight">{toast.text}</p>
            
            <button
              onClick={() => onClose(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Custom Hook to manage toast triggers
export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
