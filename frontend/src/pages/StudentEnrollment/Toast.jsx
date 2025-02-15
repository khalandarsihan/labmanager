import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const Toast = ({ toast, setToast }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "animate-in slide-in-from-right-full fade-in duration-300",
        "flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm",
        "border",
        toast.type === 'error' 
          ? "bg-red-950/90 text-red-200 border-red-700/50"
          : "bg-emerald-950/90 text-emerald-200 border-emerald-700/50"
      )}
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
      ) : (
        <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
      )}
      
      <span className="text-sm font-medium">
        {typeof toast.message === 'string' ? toast.message : 'An error occurred'}
      </span>
      
      <button 
        onClick={() => setToast(null)}
        className={cn(
          "ml-2 p-1 rounded-full transition-colors duration-200",
          "hover:bg-black/20 active:bg-black/30",
          toast.type === 'error' 
            ? "text-red-400 hover:text-red-300"
            : "text-emerald-400 hover:text-emerald-300"
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;