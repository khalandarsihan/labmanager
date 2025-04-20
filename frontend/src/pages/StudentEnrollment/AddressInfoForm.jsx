import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Building2, Globe, Flag } from 'lucide-react';
import { cn } from "@/lib/utils";

const AddressInfoForm = ({ formData, onChange, errors, useLightTheme }) => {
  // Apply theme-based styles
  const labelStyle = useLightTheme 
    ? "text-purple-700 font-medium" 
    : "text-amber-200 font-medium";
    
  const inputBg = useLightTheme
    ? "bg-white border-purple-200/50 text-purple-700 focus:border-purple-400/80 placeholder-gray-400"
    : "bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400";
    
  const iconStyle = useLightTheme
    ? "text-purple-500/70"
    : "text-amber-300/70";
    
  const errorStyle = useLightTheme
    ? "text-red-500"
    : "text-red-400";
    
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Address Field - Full width on all screens */}
      <div className="w-full">
        <Label className={cn("text-sm md:text-base", labelStyle)}>Address</Label>
        <div className="relative">
          <Textarea
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            className={cn(
              "pl-8 sm:pl-10 min-h-[80px] sm:min-h-[100px] resize-y",
              inputBg
            )}
            placeholder="Enter your address"
          />
          <MapPin className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-2 sm:top-2.5",
            iconStyle
          )} />
        </div>
        {errors.address && <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.address}</span>}
      </div>

      {/* City, State, Country, Postal Code - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>City</Label>
          <div className="relative">
            <Input
              value={formData.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
              placeholder="Enter city"
            />
            <Building2 className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
              iconStyle
            )} />
          </div>
          {errors.city && <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.city}</span>}
        </div>

        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>State</Label>
          <div className="relative">
            <Input
              value={formData.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
              placeholder="Enter state"
            />
            <Flag className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
              iconStyle
            )} />
          </div>
          {errors.state && <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.state}</span>}
        </div>

        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Country</Label>
          <div className="relative">
            <Input
              value={formData.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
              className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
              placeholder="Enter country"
            />
            <Globe className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
              iconStyle
            )} />
          </div>
          {errors.country && <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.country}</span>}
        </div>

        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Postal Code</Label>
          <div className="relative">
            <Input
              value={formData.postal_code || ''}
              onChange={(e) => onChange('postal_code', e.target.value)}
              className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
              placeholder="Enter postal code"
            />
            <MapPin className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
              iconStyle
            )} />
          </div>
          {errors.postal_code && <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.postal_code}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;