// src/pages/StudentEnrollment/RegistrationDetails.jsx
import React from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, Phone } from 'lucide-react';

const RegistrationDetails = ({ registrationId }) => {
    const { data: registrationDetails, error, isLoading } = useFrappeGetCall(
        'labmanager.api.api.get_registration_details',
        { name: registrationId }
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
                        <CardContent className="flex items-center justify-center py-12">
                            <span className="text-amber-300">Loading...</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
                        <CardContent className="flex items-center justify-center py-12">
                            <span className="text-red-500">Error loading registration details</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-amber-300">
                            Registration Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-amber-300 mb-4">Personal Information</h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                                    <div>
                                        <dt className="text-gray-400 text-sm">Full Name</dt>
                                        <dd>
                                            {registrationDetails.first_name} {registrationDetails.middle_name}{" "}
                                            {registrationDetails.last_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Email</dt>
                                        <dd className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-amber-300" />
                                            {registrationDetails.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Phone</dt>
                                        <dd className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-amber-300" />
                                            {registrationDetails.phone}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Registration ID</dt>
                                        <dd className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2 text-amber-300" />
                                            {registrationDetails.registration_id}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Academic Information */}
                            <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-amber-300 mb-4">Academic Information</h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                                    <div>
                                        <dt className="text-gray-400 text-sm">Desired Program</dt>
                                        <dd>{registrationDetails.desired_academic_program}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Islamic Studies Specialization</dt>
                                        <dd>{registrationDetails.islamic_studies_specialization}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Previous Education</dt>
                                        <dd>{registrationDetails.previous_education}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-400 text-sm">Year of Completion</dt>
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