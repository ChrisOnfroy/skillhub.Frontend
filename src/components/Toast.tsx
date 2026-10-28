import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const success = (title: string, message?: string) => showToast('success', title, message);
  const error = (title: string, message?: string) => showToast('error', title, message);
  const info = (title: string, message?: string) => showToast('info', title, message);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-caribe-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-white dark:bg-[#1e1e1b] border-emerald-500/60 text-[#0f172a] dark:text-white'
                : toast.type === 'error'
                ? 'bg-white dark:bg-[#1e1e1b] border-[#d9251d] text-[#0f172a] dark:text-white'
                : 'bg-white dark:bg-[#1e1e1b] border-black dark:border-[#27272a] text-[#0f172a] dark:text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#006534] dark:text-[#6bdd90] shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-[#d9251d] dark:text-[#ffb4a9] shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <h4 className="font-headline font-bold text-sm tracking-tight text-[#0f172a] dark:text-white">{toast.title}</h4>
              {toast.message && <p className="text-[#334155] dark:text-[#cbd5e1] mt-0.5 font-mono text-[11px]">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#64748b] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:text-white shrink-0 p-1 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#2c2c28] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};
