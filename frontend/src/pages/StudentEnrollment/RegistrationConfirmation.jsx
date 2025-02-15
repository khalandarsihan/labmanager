import React from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Mail, Phone, Download } from 'lucide-react';

const RegistrationConfirmation = ({ registrationId }) => {
  // Fetch registration details
  const { data: registrationDetails } = useFrappeGetCall(
    'labmanager.api.api.get_registration_details',
    { name: registrationId }
  );

  const handleDownloadConfirmation = () => {
    // TODO: Implement PDF download functionality
    console.log('Downloading confirmation...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute h-full w-px bg-amber-300/60 left-1/4 transform -skew-x-12"></div>
        <div className="absolute h-full w-px bg-amber-300/50 left-1/2 transform skew-x-12"></div>
        <div className="absolute h-full w-px bg-amber-300/60 left-3/4 transform -skew-x-12"></div>
        <div className="absolute w-full h-px bg-amber-300/50 top-1/4 transform -skew-y-12"></div>
        <div className="absolute w-full h-px bg-amber-300/60 top-1/2 transform skew-y-12"></div>
        <div className="absolute w-full h-px bg-amber-300/50 top-3/4 transform -skew-y-12"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-amber-300" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-amber-300">
              Application Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-center text-amber-100/70 mt-2">
              Your application reference number:<br />
              <span className="font-mono font-bold text-lg">{registrationId}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Application Details */}
              {registrationDetails && (
                <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-amber-300 mb-4">Application Details</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                    <div>
                      <dt className="text-gray-400 text-sm">Full Name</dt>
                      <dd>{registrationDetails.first_name} {registrationDetails.middle_name} {registrationDetails.last_name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Email</dt>
                      <dd>{registrationDetails.email}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Program</dt>
                      <dd>{registrationDetails.desired_academic_program}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 text-sm">Specialization</dt>
                      <dd>{registrationDetails.islamic_studies_specialization}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-semibold text-amber-300 mb-4">Next Steps</h3>
                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-start">
                    <FileText className="w-5 h-5 mr-3 text-amber-300 mt-1 flex-shrink-0" />
                    <span>Our admissions team will review your application within 5-7 business days.</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className="w-5 h-5 mr-3 text-amber-300 mt-1 flex-shrink-0" />
                    <span>You will receive an email notification about your application status.</span>
                  </li>
                  <li className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 text-amber-300 mt-1 flex-shrink-0" />
                    <span>For any queries, contact our admissions office at admissions@techethica.edu</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button 
                  onClick={() => window.location.href = '/track-application'}
                  className="bg-amber-300 text-gray-900 hover:bg-amber-400 transition-all duration-200"
                >
                  Track Your Application
                </Button>
                <Button 
                  onClick={handleDownloadConfirmation}
                  className="bg-amber-300 text-gray-900 hover:bg-amber-400 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                <Button 
                  onClick={() => window.location.href = '/course-catalog'}
                  className="bg-amber-300 text-gray-900 hover:bg-amber-400 transition-all duration-200"
                >
                  Browse Courses
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="border-amber-300/50 text-amber-300 hover:bg-amber-300/10 transition-all duration-200"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;