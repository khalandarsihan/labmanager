import React from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, Phone } from 'lucide-react';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { useTheme } from '@/components/ui/ThemeContext';
import { cn } from "@/lib/utils";

const RegistrationDetails = ({ registrationId }) => {
    const { useLightTheme, themeStyles } = useTheme();
    const { data: registrationDetails, error, isLoading } = useFrappeGetCall(
        'labmanager.api.api.get_registration_details',
        { name: registrationId }
    );

    // Apply theme-based styles
    const cardBg = useLightTheme 
        ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
        : "border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";
        
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
            <div className="min-h-screen py-8 sm:py-12 px-4">
                <BackgroundPattern />
                <div className="max-w-4xl mx-auto relative z-10">
                    <Card className={cn(cardBg, "backdrop-blur-sm")}>
                        <CardContent className="flex items-center justify-center py-8 sm:py-12">
                            <span className={cn("text-base sm:text-lg", loadingText)}>Loading...</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-8 sm:py-12 px-4">
                <BackgroundPattern />
                <div className="max-w-4xl mx-auto relative z-10">
                    <Card className={cn(cardBg, "backdrop-blur-sm")}>
                        <CardContent className="flex items-center justify-center py-8 sm:py-12">
                            <span className={cn("text-base sm:text-lg", errorText)}>
                                Error loading registration details
                            </span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 sm:py-12 px-4">
            <BackgroundPattern />
            <div className="max-w-4xl mx-auto relative z-10">
                <Card className={cn(cardBg, "backdrop-blur-sm")}>
                    <CardHeader className="px-4 sm:px-6 py-6 sm:py-8">
                        <CardTitle className={cn(
                            "text-xl sm:text-2xl font-bold text-center",
                            headerText
                        )}>
                            Registration Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Personal Information */}
                            <div className={cn(
                                "rounded-lg p-4 sm:p-6 backdrop-blur-sm border",
                                sectionBg
                            )}>
                                <h3 className={cn(
                                    "text-base sm:text-lg font-semibold mb-4",
                                    headerText
                                )}>
                                    Personal Information
                                </h3>
                                <dl className={cn(
                                    "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    valueText
                                )}>
                                    <div className="sm:col-span-2">
                                        <dt className={cn("text-sm", labelText)}>Full Name</dt>
                                        <dd className="text-base mt-1">
                                            {registrationDetails.first_name} {registrationDetails.middle_name}{" "}
                                            {registrationDetails.last_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={cn("text-sm", labelText)}>Email</dt>
                                        <dd className="flex items-center text-sm sm:text-base mt-1 break-all">
                                            <Mail className={cn("w-4 h-4 mr-2 flex-shrink-0", iconColor)} />
                                            {registrationDetails.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={cn("text-sm", labelText)}>Phone</dt>
                                        <dd className="flex items-center text-sm sm:text-base mt-1">
                                            <Phone className={cn("w-4 h-4 mr-2", iconColor)} />
                                            {registrationDetails.phone}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className={cn("text-sm", labelText)}>Registration ID</dt>
                                        <dd className="flex items-center text-sm sm:text-base mt-1">
                                            <FileText className={cn("w-4 h-4 mr-2", iconColor)} />
                                            {registrationDetails.registration_id}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Academic Information */}
                            <div className={cn(
                                "rounded-lg p-4 sm:p-6 backdrop-blur-sm border",
                                sectionBg
                            )}>
                                <h3 className={cn(
                                    "text-base sm:text-lg font-semibold mb-4",
                                    headerText
                                )}>
                                    Academic Information
                                </h3>
                                <dl className={cn(
                                    "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    valueText
                                )}>
                                    <div className="sm:col-span-2">
                                        <dt className={cn("text-sm", labelText)}>Desired Program</dt>
                                        <dd className="text-base mt-1">
                                            {registrationDetails.desired_academic_program}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className={cn("text-sm", labelText)}>Islamic Studies Specialization</dt>
                                        <dd className="text-base mt-1">
                                            {registrationDetails.islamic_studies_specialization}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={cn("text-sm", labelText)}>Previous Education</dt>
                                        <dd className="text-base mt-1">
                                            {registrationDetails.previous_education}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className={cn("text-sm", labelText)}>Year of Completion</dt>
                                        <dd className="text-base mt-1">
                                            {registrationDetails.year_of_completion}
                                        </dd>
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