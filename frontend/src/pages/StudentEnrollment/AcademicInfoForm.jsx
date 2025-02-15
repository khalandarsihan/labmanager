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

const AcademicInfoForm = ({ formData, onChange, errors }) => {
  // Fetch API data
  const { data: programsData } = useFrappeGetCall('labmanager.api.api.get_academic_programs');
  const { data: specializationsData } = useFrappeGetCall('labmanager.api.api.get_islamic_specializations');
  const { data: educationLevelsData } = useFrappeGetCall('labmanager.api.api.get_education_levels');

  // Extract options with proper null checks
  const programOptions = programsData?.message?.programs || [];
  const specializationOptions = specializationsData?.message?.specializations || [];
  const educationOptions = educationLevelsData?.message?.education_levels || [];

  return (
    <div className="space-y-6">
      {/* Desired Program & Islamic Studies Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-amber-200 font-medium">Desired Academic Program</Label>
          <Select
            value={formData.desired_academic_program || ""}
            onValueChange={(value) => onChange('desired_academic_program', value)}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50">
              <SelectValue placeholder="Select desired program" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {programOptions.map((program) => (
                <SelectItem
                  key={program}
                  value={program}
                  className="text-amber-100 hover:bg-gray-700"
                >
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.desired_academic_program && (
            <span className="text-red-400 text-sm mt-1">{errors.desired_academic_program}</span>
          )}
        </div>

        <div>
          <Label className="text-amber-200 font-medium">Islamic Studies Specialization</Label>
          <Select
            value={formData.islamic_studies_specialization || ""}
            onValueChange={(value) => onChange('islamic_studies_specialization', value)}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {specializationOptions.map((spec) => (
                <SelectItem
                  key={spec}
                  value={spec}
                  className="text-amber-100 hover:bg-gray-700"
                >
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.islamic_studies_specialization && (
            <span className="text-red-400 text-sm mt-1">
              {errors.islamic_studies_specialization}
            </span>
          )}
        </div>
      </div>

      {/* Previous Education & Year Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-amber-200 font-medium">Previous Education</Label>
          <Select
            value={formData.previous_education || ""}
            onValueChange={(value) => onChange('previous_education', value)}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50">
              <SelectValue placeholder="Select previous education" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {educationOptions.map((level) => (
                <SelectItem
                  key={level}
                  value={level}
                  className="text-amber-100 hover:bg-gray-700"
                >
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.previous_education && (
            <span className="text-red-400 text-sm mt-1">{errors.previous_education}</span>
          )}
        </div>

        <div>
          <Label className="text-amber-200 font-medium">Year of Completion</Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.year_of_completion || ""}
              onChange={(e) => onChange('year_of_completion', e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
              placeholder="YYYY"
              min="1900"
              max="2024"
            />
            <Calendar className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
          </div>
          {errors.year_of_completion && (
            <span className="text-red-400 text-sm mt-1">{errors.year_of_completion}</span>
          )}
        </div>
      </div>

      {/* Previous Institution */}
      <div>
        <Label className="text-amber-200 font-medium">Previous Institution</Label>
        <div className="relative">
          <Input
            value={formData.institution || ""}
            onChange={(e) => onChange('institution', e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700/50 text-amber-100 focus:border-amber-300/50 placeholder-gray-400"
            placeholder="Enter your previous institution"
          />
          <Building2 className="w-5 h-5 absolute left-3 top-2.5 text-amber-300/70" />
        </div>
        {errors.institution && (
          <span className="text-red-400 text-sm mt-1">{errors.institution}</span>
        )}
      </div>

      {/* Educational Journey Info Box */}
      <div className="mt-8 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg backdrop-blur-sm">
        <div className="flex items-center mb-2">
          <Building2 className="w-5 h-5 text-amber-300 mr-2" />
          <span className="text-amber-200 font-medium">Educational Journey</span>
        </div>
        <p className="text-amber-100/70 text-sm">
          Your academic background helps us tailor the learning experience to your needs.
          Make sure to provide accurate information about your previous studies.
        </p>
      </div>
    </div>
  );
};

export default AcademicInfoForm;