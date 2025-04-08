import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, Upload, Calendar } from 'lucide-react';

const PersonalInfoForm = ({ formData, onChange, errors, useLightTheme }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange('profile_image', file);
    }
  };

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
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div className={`w-32 h-32 rounded-full ${useLightTheme ? 'bg-white/80 border-amber-400/50' : 'bg-gray-800/50 border-amber-300/50'} border-2 overflow-hidden flex items-center justify-center ${useLightTheme ? 'hover:border-amber-400/80' : 'hover:border-amber-300/70'} transition-colors duration-300`}>
            {formData.profile_image ? (
              <img
                src={URL.createObjectURL(formData.profile_image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className={`w-16 h-16 ${iconStyle}`} />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`absolute inset-0 ${useLightTheme ? 'bg-gray-200/50' : 'bg-gray-900/50'} opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center backdrop-blur-sm`}>
            <Upload className={`w-8 h-8 ${useLightTheme ? 'text-purple-500' : 'text-amber-300'}`} />
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className={labelStyle}>First Name</Label>
          <div className="relative">
            <Input
              value={formData.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter first name"
            />
            <User className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.first_name && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.first_name}</span>}
        </div>

        <div>
          <Label className={labelStyle}>Middle Name</Label>
          <div className="relative">
            <Input
              value={formData.middle_name || ''}
              onChange={(e) => onChange('middle_name', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter middle name"
            />
            <User className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
        </div>

        <div>
          <Label className={labelStyle}>Last Name</Label>
          <div className="relative">
            <Input
              value={formData.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter last name"
            />
            <User className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.last_name && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.last_name}</span>}
        </div>
      </div>

      {/* Contact & Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={labelStyle}>Email</Label>
          <div className="relative">
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter email address"
            />
            <Mail className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.email && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.email}</span>}
        </div>

        <div>
          <Label className={labelStyle}>Phone</Label>
          <div className="relative">
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className={`pl-10 ${inputBg}`}
              placeholder="Enter phone number"
            />
            <Phone className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.phone && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.phone}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={labelStyle}>Date of Birth</Label>
          <div className="relative">
            <Input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => onChange('date_of_birth', e.target.value)}
              className={`pl-10 ${inputBg}`}
            />
            <Calendar className={`w-5 h-5 absolute left-3 top-2.5 ${iconStyle}`} />
          </div>
          {errors.date_of_birth && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.date_of_birth}</span>}
        </div>

        <div>
          <Label className={labelStyle}>Gender</Label>
          <Select 
            value={formData.gender || ''}
            onValueChange={(value) => onChange('gender', value)}
          >
            <SelectTrigger className={inputBg}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className={useLightTheme ? "bg-white border-purple-200" : "bg-gray-800 border-gray-700"}>
              <SelectItem value="Male" className={useLightTheme ? "text-purple-700 hover:bg-purple-50" : "text-amber-100 hover:bg-gray-700"}>Male</SelectItem>
              <SelectItem value="Female" className={useLightTheme ? "text-purple-700 hover:bg-purple-50" : "text-amber-100 hover:bg-gray-700"}>Female</SelectItem>
              <SelectItem value="Other" className={useLightTheme ? "text-purple-700 hover:bg-purple-50" : "text-amber-100 hover:bg-gray-700"}>Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <span className={`text-sm mt-1 ${errorStyle}`}>{errors.gender}</span>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;