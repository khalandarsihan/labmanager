// frontend/src/components/ui/badge.jsx
import React from "react";
import { cn } from "@/lib/utils";

const Badge = ({ className, variant = "default", ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && 
          "bg-amber-300 text-gray-900 hover:bg-amber-400/80",
        variant === "secondary" && 
          "bg-gray-700/50 border border-gray-700/50 text-amber-100 hover:bg-gray-700/80",
        variant === "outline" && 
          "border border-amber-300/50 text-amber-300",
        variant === "success" && 
          "bg-emerald-600 text-white hover:bg-emerald-700",
        variant === "warning" && 
          "bg-amber-600 text-white hover:bg-amber-700",
        variant === "danger" && 
          "bg-red-600 text-white hover:bg-red-700",
        variant === "info" && 
          "bg-blue-600 text-white hover:bg-blue-700",
        className
      )}
      {...props}
    />
  );
};

export { Badge };