// frontend/src/components/ui/toast.jsx
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ({ children }) => {
  return (
    <div 
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      {children}
    </div>
  );
};

const Toast = ({
  className,
  title,
  description,
  variant = "default",
  onClose,
  ...props
}) => {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default" 
          ? "border-gray-700/50 bg-gray-800/95 text-amber-100" 
          : variant === "destructive"
          ? "border-red-700/50 bg-red-950/95 text-red-100"
          : "border-emerald-700/50 bg-emerald-950/95 text-emerald-100",
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-medium">{title}</div>}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Simple toast state manager for your app
const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
    
    return id;
  }, []);

  const dismissToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Component to render all active toasts
  const Toaster = React.useCallback(() => {
    return (
      <ToastProvider>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => dismissToast(toast.id)}
          />
        ))}
      </ToastProvider>
    );
  }, [toasts, dismissToast]);

  return { toast, dismissToast, Toaster };
};

export { Toast, ToastProvider, useToast };