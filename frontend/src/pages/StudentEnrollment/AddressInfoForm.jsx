// src/pages/StudentEnrollment/forms/AddressInfoForm.jsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Building2, Globe, Flag } from 'lucide-react';

const AddressInfoForm = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Address Field */}
      <div>
        <Label className="text-amber-200 font-medium">Address</Label>
        <div className="relative">
          <Textarea
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 min-h-[100px] focus:border-amber-300/50 placeholder-gray-400"
            placeholder="Enter your address"
          />
          <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
        </div>
        {errors.address && <span className="text-red-400 text-sm mt-1">{errors.address}</span>}
      </div>

      {/* City, State, Country, Postal Code */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-amber-200 font-medium">City</Label>
          <div className="relative">
            <Input
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
              placeholder="Enter city"
            />
            <Building2 className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
          </div>
          {errors.city && <span className="text-red-400 text-sm mt-1">{errors.city}</span>}
        </div>

        <div>
          <Label className="text-amber-200 font-medium">State</Label>
          <div className="relative">
            <Input
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
              placeholder="Enter state"
            />
            <Flag className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
          </div>
          {errors.state && <span className="text-red-400 text-sm mt-1">{errors.state}</span>}
        </div>

        <div>
          <Label className="text-amber-200 font-medium">Country</Label>
          <div className="relative">
            <Input
              value={formData.country}
              onChange={(e) => onChange('country', e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
              placeholder="Enter country"
            />
            <Globe className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
          </div>
          {errors.country && <span className="text-red-400 text-sm mt-1">{errors.country}</span>}
        </div>

        <div>
          <Label className="text-amber-200 font-medium">Postal Code</Label>
          <div className="relative">
            <Input
              value={formData.postal_code}
              onChange={(e) => onChange('postal_code', e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
              placeholder="Enter postal code"
            />
            <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
          </div>
          {errors.postal_code && <span className="text-red-400 text-sm mt-1">{errors.postal_code}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;