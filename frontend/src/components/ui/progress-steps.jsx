// src/components/ui/progress-steps.jsx
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const ProgressSteps = React.forwardRef(({ 
  className, 
  currentStep, 
  totalSteps, 
  labels = [], 
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("w-full mb-8", className)} 
      {...props}
    >
      {/* Steps with Connecting Line */}
      <div className="flex justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-amber-300 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} 
        />

        {/* Step Indicators */}
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
              currentStep >= step 
                ? "border-amber-300 bg-gray-800 text-amber-300"
                : "border-gray-700 bg-gray-800 text-gray-500"
            )}
          >
            {currentStep > step ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <span className="text-lg font-semibold">{step}</span>
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      {labels.length > 0 && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span 
              key={index}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                currentStep > index 
                  ? "text-amber-200" 
                  : currentStep === index + 1
                    ? "text-amber-200"
                    : "text-gray-500"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

ProgressSteps.displayName = "ProgressSteps";

// Variant for vertical progress steps
const VerticalProgressSteps = React.forwardRef(({ 
  className, 
  currentStep, 
  totalSteps, 
  labels = [], 
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("flex flex-col space-y-4", className)} 
      {...props}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center space-x-4">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
              currentStep >= step 
                ? "border-amber-300 bg-gray-800 text-amber-300"
                : "border-gray-700 bg-gray-800 text-gray-500"
            )}
          >
            {currentStep > step ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <span className="text-lg font-semibold">{step}</span>
            )}
          </div>
          {labels[step - 1] && (
            <span 
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                currentStep >= step ? "text-amber-200" : "text-gray-500"
              )}
            >
              {labels[step - 1]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

VerticalProgressSteps.displayName = "VerticalProgressSteps";

export { ProgressSteps, VerticalProgressSteps };