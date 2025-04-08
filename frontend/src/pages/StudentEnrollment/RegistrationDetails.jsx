// src/pages/StudentEnrollment/RegistrationDetails.jsx
import React from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, Phone } from 'lucide-react';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { useTheme } from '@/components/ui/ThemeContext';

const RegistrationDetails = ({ registrationId }) => {
    const { useLightTheme, themeStyles } = useTheme();
    const { data: registrationDetails, error, isLoading } = useFrappeGetCall(
        'labmanager.api.api.get_registration_details',
        { name: registrationId }
    );

    // Apply theme-based styles
    // const cardBg = useLightTheme
    //     ? "border-purple-200/50 bg-white/80"
    //     : "border-gray-700/50 bg-gray-800/50";

    const cardBg = useLightTheme 
    ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]"
  
        
    const headerText = useLightTheme
        ? "text-purple-700"
        : "text-amber-300";
        
    const sectionBg = useLightTheme
        ? "bg-purple-50/80 border-purple-200/50"
        : "bg-gray-700/30 border-gray-700/50";
        
    const labelText = useLightTheme
        ? "text-purple-400"
        : "text-gray-400";
        
    const valueText = useLightTheme
        ? "text-gray-700"
        : "text-gray-200";
        
    const iconColor = useLightTheme
        ? "text-purple-500"
        : "text-amber-300";
        
    const loadingText = useLightTheme
        ? "text-purple-600"
        : "text-amber-300";
        
    const errorText = useLightTheme
        ? "text-red-500"
        : "text-red-400";

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 px-4">
                <BackgroundPattern />
                <div className="max-w-4xl mx-auto relative z-10">
                    <Card className={`${cardBg} backdrop-blur-sm`}>
                        <CardContent className="flex items-center justify-center py-12">
                            <span className={loadingText}>Loading...</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-12 px-4">
                <BackgroundPattern />
                <div className="max-w-4xl mx-auto relative z-10">
                    <Card className={`${cardBg} backdrop-blur-sm`}>
                        <CardContent className="flex items-center justify-center py-12">
                            <span className={errorText}>Error loading registration details</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <BackgroundPattern />
            <div className="max-w-4xl mx-auto relative z-10">
                <Card className={`${cardBg} backdrop-blur-sm`}>
                    <CardHeader>
                        <CardTitle className={`text-2xl font-bold text-center ${headerText}`}>
                            Registration Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className={`${sectionBg} rounded-lg p-6 backdrop-blur-sm border`}>
                                <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Personal Information</h3>
                                <dl className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${valueText}`}>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Full Name</dt>
                                        <dd>
                                            {registrationDetails.first_name} {registrationDetails.middle_name}{" "}
                                            {registrationDetails.last_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Email</dt>
                                        <dd className="flex items-center">
                                            <Mail className={`w-4 h-4 mr-2 ${iconColor}`} />
                                            {registrationDetails.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Phone</dt>
                                        <dd className="flex items-center">
                                            <Phone className={`w-4 h-4 mr-2 ${iconColor}`} />
                                            {registrationDetails.phone}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Registration ID</dt>
                                        <dd className="flex items-center">
                                            <FileText className={`w-4 h-4 mr-2 ${iconColor}`} />
                                            {registrationDetails.registration_id}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Academic Information */}
                            <div className={`${sectionBg} rounded-lg p-6 backdrop-blur-sm border`}>
                                <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Academic Information</h3>
                                <dl className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${valueText}`}>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Desired Program</dt>
                                        <dd>{registrationDetails.desired_academic_program}</dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Islamic Studies Specialization</dt>
                                        <dd>{registrationDetails.islamic_studies_specialization}</dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Previous Education</dt>
                                        <dd>{registrationDetails.previous_education}</dd>
                                    </div>
                                    <div>
                                        <dt className={`${labelText} text-sm`}>Year of Completion</dt>
                                        <dd>{registrationDetails.year_of_completion}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegistrationDetails;