import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Building2, Globe, Flag } from 'lucide-react';

const AddressInfoForm = ({ formData, onChange, errors, useLightTheme }) => {
  // Apply theme-based styles
  const labelStyle = useLightTheme 
    ? "text-amber-700 font-medium" 
    : "text-amber-200 font-medium";
    
  const inputBg = useLightTheme
    ? "bg-white border-amber-200/50 text-gray-700 focus:border-amber-400/80 placeholder-gray-400"
    : "bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400";
    
  const iconStyle = useLightTheme
    ? "text-amber-500/70"
    : "text-amber-300/70";
    
  const errorStyle = useLightTheme
    ? "text-red-500"
    : "text-red-400";
    
  return (
    <div className="space-y-6">
      {/* Address Field */}
      <div>
        <Label className={labelStyle}>Address</Label>
        <div className="relative">
          <Textarea
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            className={`pl-10 ${inputBg} min-h-[100px]`}
            placeholder="Enter your address"
          />
          <MapPin className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
        </div>
        {errors.address && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.address}</span>}
      </div>

      {/* City, State, Country, Postal Code */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className={labelStyle}>City</Label>
          <div className="relative">
            <Input
              value={formData.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter city"
            />
            <Building2 className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.city && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.city}</span>}
        </div>

        <div>
          <Label className={labelStyle}>State</Label>
          <div className="relative">
            <Input
              value={formData.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter state"
            />
            <Flag className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.state && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.state}</span>}
        </div>

        <div>
          <Label className={labelStyle}>Country</Label>
          <div className="relative">
            <Input
              value={formData.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter country"
            />
            <Globe className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.country && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.country}</span>}
        </div>

        <div>
          <Label className={labelStyle}>Postal Code</Label>
          <div className="relative">
            <Input
              value={formData.postal_code || ''}
              onChange={(e) => onChange('postal_code', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter postal code"
            />
            <MapPin className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.postal_code && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.postal_code}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;