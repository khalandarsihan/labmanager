import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTheme } from '@/components/ui/ThemeContext';

const Toast = ({ toast, setToast }) => {
  const { useLightTheme } = useTheme();
  
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

  // Define styles based on theme and toast type
  const errorStyle = useLightTheme
    ? "bg-red-50/90 text-red-700 border-red-300/50"
    : "bg-red-950/90 text-red-200 border-red-700/50";
    
  const successStyle = useLightTheme
    ? "bg-emerald-50/90 text-emerald-700 border-emerald-300/50"
    : "bg-emerald-950/90 text-emerald-200 border-emerald-700/50";
    
  const iconStyle = useLightTheme
    ? (toast.type === 'error' ? "text-red-600" : "text-emerald-600")
    : (toast.type === 'error' ? "text-red-400" : "text-emerald-400");
    
  const closeButtonStyle = useLightTheme
    ? (toast.type === 'error'
        ? "text-red-600 hover:text-red-800 hover:bg-red-100/50"
        : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/50")
    : (toast.type === 'error'
        ? "text-red-400 hover:text-red-300 hover:bg-red-900/50"
        : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50");

  return (
    <div
      className={cn(
        "fixed bottom-4 w-[calc(100%-2rem)] sm:w-auto mx-4 sm:mx-0 sm:right-4 z-50",
        "animate-in slide-in-from-bottom-4 sm:slide-in-from-right-full fade-in duration-300",
        "flex items-center gap-2 sm:gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm",
        "border",
        toast.type === 'error' ? errorStyle : successStyle,
        "max-w-sm sm:max-w-md"
      )}
    >
      {toast.type === 'error' ? (
        <AlertCircle className={cn("w-5 h-5 flex-shrink-0", iconStyle)} />
      ) : (
        <CheckCircle className={cn("w-5 h-5 flex-shrink-0", iconStyle)} />
      )}
      
      <span className="text-sm sm:text-base font-medium flex-1">
        {typeof toast.message === 'string' ? toast.message : 'An error occurred'}
      </span>
      
      <button 
        onClick={() => setToast(null)}
        className={cn(
          "ml-2 p-1 rounded-full transition-colors duration-200",
          closeButtonStyle
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;