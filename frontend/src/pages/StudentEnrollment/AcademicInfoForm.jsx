import React from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

const AcademicInfoForm = ({ formData, onChange, errors, useLightTheme }) => {
  // Fetch API data
  const { data: programsData } = useFrappeGetCall('labmanager.api.api.get_academic_programs');
  const { data: specializationsData } = useFrappeGetCall('labmanager.api.api.get_islamic_specializations');
  const { data: educationLevelsData } = useFrappeGetCall('labmanager.api.api.get_education_levels');

  // Extract options with proper null checks
  const programOptions = programsData?.message?.programs || [];
  const specializationOptions = specializationsData?.message?.specializations || [];
  const educationOptions = educationLevelsData?.message?.education_levels || [];

  // Apply theme-based styles
  const labelStyle = useLightTheme 
    ? "text-purple-700 font-medium" 
    : "text-amber-200 font-medium";
    
  const inputBg = useLightTheme
    ? "bg-white border-purple-200/50 text-gray-700 focus:border-purple-400/80 placeholder-gray-400"
    : "bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400";
    
  const selectBg = useLightTheme
    ? "bg-white border-purple-200/50 text-purple-700 focus:border-purple-400/80"
    : "bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50";
    
  const selectContent = useLightTheme
    ? "bg-white border-purple-200"
    : "bg-gray-800 border-gray-700";
    
  const selectItem = useLightTheme
    ? "text-purple-700 hover:bg-purple-50"
    : "text-amber-100 hover:bg-gray-700";
    
  const iconStyle = useLightTheme
    ? "text-purple-500/70"
    : "text-amber-300/70";
    
  const errorStyle = useLightTheme
    ? "text-red-500"
    : "text-red-400";
    
  const infoBgStyle = useLightTheme
    ? "bg-purple-50/80 border-purple-200/50"
    : "bg-gray-800/30 border-gray-700/50";
    
  const infoTitleStyle = useLightTheme
    ? "text-purple-700"
    : "text-amber-200";
    
  const infoTextStyle = useLightTheme
    ? "text-purple-700/70"
    : "text-amber-100/70";

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Desired Program & Islamic Studies Row - Stack on mobile, grid on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Desired Academic Program</Label>
          <Select
            value={formData.desired_academic_program || ""}
            onValueChange={(value) => onChange('desired_academic_program', value)}
          >
            <SelectTrigger className={cn("h-10 sm:h-12", selectBg)}>
              <SelectValue placeholder="Select desired program" />
            </SelectTrigger>
            <SelectContent className={selectContent}>
              {programOptions.map((program) => (
                <SelectItem
                  key={program}
                  value={program}
                  className={selectItem}
                >
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.desired_academic_program && (
            <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.desired_academic_program}</span>
          )}
        </div>

        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Islamic Studies Specialization</Label>
          <Select
            value={formData.islamic_studies_specialization || ""}
            onValueChange={(value) => onChange('islamic_studies_specialization', value)}
          >
            <SelectTrigger className={cn("h-10 sm:h-12", selectBg)}>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent className={selectContent}>
              {specializationOptions.map((spec) => (
                <SelectItem
                  key={spec}
                  value={spec}
                  className={selectItem}
                >
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.islamic_studies_specialization && (
            <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>
              {errors.islamic_studies_specialization}
            </span>
          )}
        </div>
      </div>

      {/* Previous Education & Year Row - Stack on mobile, grid on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Previous Education</Label>
          <Select
            value={formData.previous_education || ""}
            onValueChange={(value) => onChange('previous_education', value)}
          >
            <SelectTrigger className={cn("h-10 sm:h-12", selectBg)}>
              <SelectValue placeholder="Select previous education" />
            </SelectTrigger>
            <SelectContent className={selectContent}>
              {educationOptions.map((level) => (
                <SelectItem
                  key={level}
                  value={level}
                  className={selectItem}
                >
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.previous_education && (
            <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.previous_education}</span>
          )}
        </div>

        <div className="w-full">
          <Label className={cn("text-sm md:text-base", labelStyle)}>Year of Completion</Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.year_of_completion || ""}
              onChange={(e) => onChange('year_of_completion', e.target.value)}
              className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
              placeholder="YYYY"
              min="1900"
              max="2024"
            />
            <Calendar className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
              iconStyle
            )} />
          </div>
          {errors.year_of_completion && (
            <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.year_of_completion}</span>
          )}
        </div>
      </div>

      {/* Previous Institution - Full width on all screens */}
      <div className="w-full">
        <Label className={cn("text-sm md:text-base", labelStyle)}>Previous Institution</Label>
        <div className="relative">
          <Input
            value={formData.institution || ""}
            onChange={(e) => onChange('institution', e.target.value)}
            className={cn("pl-8 sm:pl-10 h-10 sm:h-12", inputBg)}
            placeholder="Enter your previous institution"
          />
          <Building2 className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-3 sm:top-3.5",
            iconStyle
          )} />
        </div>
        {errors.institution && (
          <span className={cn("text-xs sm:text-sm mt-1", errorStyle)}>{errors.institution}</span>
        )}
      </div>

      {/* Educational Journey Info Box - Adjusted padding and text size for mobile */}
      <div className={cn(
        "mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg backdrop-blur-sm",
        infoBgStyle
      )}>
        <div className="flex items-center mb-2">
          <Building2 className={cn("w-4 h-4 sm:w-5 sm:h-5 mr-2", iconStyle)} />
          <span className={cn("text-sm sm:text-base font-medium", infoTitleStyle)}>Educational Journey</span>
        </div>
        <p className={cn("text-xs sm:text-sm", infoTextStyle)}>
          Your academic background helps us tailor the learning experience to your needs.
          Make sure to provide accurate information about your previous studies.
        </p>
      </div>
    </div>
  );
};

export default AcademicInfoForm;