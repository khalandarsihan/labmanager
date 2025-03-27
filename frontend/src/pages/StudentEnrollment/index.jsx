import React, { useState } from 'react';
import { useFrappePostCall, useFrappeGetCall } from 'frappe-react-sdk';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import AddressInfoForm from './AddressInfoForm';
import AcademicInfoForm from './AcademicInfoForm';
import Toast from './Toast';
import RegistrationConfirmation from './RegistrationConfirmation';
import BackgroundPattern from '@/components/ui/BackgroundPattern'; 

const StudentEnrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationId, setRegistrationId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    personal: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      profile_image: null
    },
    address: {
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    },
    academic: {
      desired_academic_program: '',
      islamic_studies_specialization: '',
      previous_education: '',
      year_of_completion: '',
      institution: ''
    }
  });

  // API calls
  const { call: submitRegistration } = useFrappePostCall('labmanager.api.api.register_student');
  const { data: academicPrograms } = useFrappeGetCall('labmanager.api.api.get_academic_programs');
  const { data: islamicSpecializations } = useFrappeGetCall('labmanager.api.api.get_islamic_specializations');
  const { data: educationLevels } = useFrappeGetCall('labmanager.api.api.get_education_levels');

  const validateAllFields = () => {
    const newErrors = {};
    
    // Personal Info validation
    if (!formData.personal.first_name) newErrors.first_name = 'First name is required';
    if (!formData.personal.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.personal.email) newErrors.email = 'Email is required';
    if (!formData.personal.phone) newErrors.phone = 'Phone is required';
    
    // Address validation
    if (!formData.address.address) newErrors.address = 'Address is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.country) newErrors.country = 'Country is required';
    
    // Academic validation
    if (!formData.academic.previous_education) newErrors.previous_education = 'Previous education is required';
    if (!formData.academic.desired_academic_program) newErrors.desired_academic_program = 'Desired program is required';
    if (!formData.academic.islamic_studies_specialization) newErrors.islamic_studies_specialization = 'Islamic specialization is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (validateAllFields()) {
      setIsSubmitting(true);
      try {
        const submissionData = {
          ...formData.personal,
          ...formData.address,
          ...formData.academic,
          year_of_completion: parseInt(formData.academic.year_of_completion, 10) || null
        };

        const response = await submitRegistration(submissionData);

        if (response?.message?.status === 'success') {
          const registrationId = response.message.registration_id;
          
          // Store in localStorage
          localStorage.setItem('registration_id', registrationId);
          
          // Update state
          setRegistrationId(registrationId);
          setIsSubmitted(true);
          
          // Show success toast
          setToast({
            type: 'success',
            message: `Registration successful! Your registration ID is ${registrationId}`
          });

          // Navigate after delay
          // setTimeout(() => {
          //   window.location.href = `/student-registration/confirmation?id=${registrationId}`;
          // }, 2000);
        } else {
          setToast({
            type: 'error',
            message: response?.message?.message || 'Registration failed'
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setToast({
          type: 'error',
          message: 'Registration failed. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setToast({
        type: 'error',
        message: 'Please fill all required fields before submitting'
      });
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData.personal}
            onChange={(field, value) => handleInputChange('personal', field, value)}
            errors={errors}
          />
        );
      case 2:
        return (
          <AddressInfoForm
            formData={formData.address}
            onChange={(field, value) => handleInputChange('address', field, value)}
            errors={errors}
          />
        );
      case 3:
        return (
          <AcademicInfoForm
            formData={formData.academic}
            onChange={(field, value) => handleInputChange('academic', field, value)}
            errors={errors}
            academicPrograms={academicPrograms?.message?.programs || []}
            islamicSpecializations={islamicSpecializations?.message?.specializations || []}
            educationLevels={educationLevels?.message?.education_levels || []}
          />
        );
      default:
        return null;
    }
  };

  // if (isSubmitted) {
  //   return <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-12 px-4">
  //     <div className="max-w-4xl mx-auto">
  //       <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
  //         <CardContent className="flex flex-col items-center justify-center py-12">
  //           <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
  //           <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
  //           <p className="text-gray-300 text-center mb-4">
  //             Your registration ID is: <span className="font-mono font-bold text-amber-300">{registrationId}</span>
  //           </p>
  //           <p className="text-gray-400 text-center mb-6">
  //             Please save this ID for future reference. You will be redirected to the confirmation page shortly...
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </div>;
  // }


    if (isSubmitted) {
      return <RegistrationConfirmation registrationId={registrationId} />;
    }
  return (

    <div className="relative">
    {/* BackgroundPattern is positioned behind everything */}
    <BackgroundPattern />

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-300">
              Student Registration
            </CardTitle>
            <CardDescription className="text-center text-amber-100/70">
              Join our community of learners at TechEthica
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <ProgressSteps
              currentStep={currentStep}
              totalSteps={3}
              labels={["Personal Info", "Address", "Academic Details"]}
              className="mb-8"
            />

            <div className="relative backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
              {getStepContent()}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1 || isSubmitting}
                className={cn(
                  "bg-amber-300 text-gray-900 border-0",
                  "hover:bg-amber-400",
                  "disabled:bg-gray-800/50 disabled:text-gray-500 disabled:border disabled:border-gray-700/50",
                  "transition-all duration-200 ease-in-out"
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={currentStep === totalSteps ? handleSubmit : () => setCurrentStep(prev => prev + 1)}
                disabled={isSubmitting}
                className={cn(
                  "bg-amber-300 text-gray-900",
                  "hover:bg-amber-400",
                  "transition-all duration-200 ease-in-out"
                )}
              >
                {currentStep === totalSteps ? (
                  <>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast component */}
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};

export default StudentEnrollment;