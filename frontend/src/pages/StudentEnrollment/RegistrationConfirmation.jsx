import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Mail, Phone, Download } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useToast } from '@/components/ui/toast';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { useTheme } from '@/components/ui/ThemeContext';
import { useFrappePostCall } from 'frappe-react-sdk';

const RegistrationConfirmation = ({ registrationId, studentData = {} }) => {
  const { toast, Toaster } = useToast();
  const [localStudentData, setLocalStudentData] = useState(studentData || {});
  const { useLightTheme, themeStyles } = useTheme();
  const [emailSent, setEmailSent] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const { call: sendPdfEmail, loading: emailSending } = useFrappePostCall('labmanager.api.api.send_registration_pdf');

  // Check for registration ID in localStorage if not provided via props
  useEffect(() => {
    if (Object.keys(studentData).length === 0) {
      try {
        const savedData = localStorage.getItem('registration_form_data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Combine all sections into one flat object
          const flattenedData = {
            ...parsedData.personal,
            ...parsedData.address,
            ...parsedData.academic
          };
          setLocalStudentData(flattenedData);
          console.log("Loaded student data from localStorage:", flattenedData);
        }
      } catch (error) {
        console.error("Error loading student data from localStorage:", error);
      }
    }
  }, [studentData]);

  // Auto-generate PDF and send email when component mounts - with improved error handling
  useEffect(() => {
    if (registrationId && localStudentData && Object.keys(localStudentData).length > 0 && !emailSent) {
      // Trigger PDF generation and email sending after component is fully mounted
      const timer = setTimeout(() => {
        handleGenerateAndSendPdf();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [registrationId, localStudentData, emailSent]);

  // Apply theme-based styles
  const cardBg = useLightTheme 
    ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]";
    
  const headerText = useLightTheme
    ? "text-purple-700"
    : "text-amber-300";
    
  const descriptionText = useLightTheme
    ? "text-purple-600/70"
    : "text-amber-100/70";
    
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
    
  const buttonPrimary = useLightTheme
    ? "bg-purple-600 text-white hover:bg-purple-700"
    : "bg-amber-300 text-gray-900 hover:bg-amber-400";
    
  const buttonOutline = useLightTheme
    ? "border-purple-300/50 text-purple-600 hover:bg-purple-500/10"
    : "border-amber-300/50 text-amber-300 hover:bg-amber-300/10";

  // New function - handle PDF generation and email sending in one function
  const handleGenerateAndSendPdf = async () => {
    if (pdfGenerating || emailSending || emailSent) return;
    
    setPdfGenerating(true);
    try {
      // Generate the PDF
      const pdfBytes = await generatePdf();
      
      // Convert the PDF bytes to base64
      const base64Pdf = arrayBufferToBase64(pdfBytes);
      
      // Download PDF locally
      downloadPdf(pdfBytes);
      
      // Only send email if we have a valid email and registration ID
      if (localStudentData.email && registrationId) {
        try {
          // Send the PDF via email API
          const response = await sendPdfEmail({
            registration_id: registrationId,
            email: localStudentData.email,
            pdf_data: base64Pdf,
            first_name: localStudentData.first_name || '',
            middle_name: localStudentData.middle_name || '',
            last_name: localStudentData.last_name || ''
          });
          
          if (response?.status === 'success') {
            setEmailSent(true);
            toast({
              title: 'Success',
              description: 'Confirmation PDF also sent to your email'
            });
          } else {
            console.error('Email sending failed:', response?.message);
            toast({
              title: 'Note',
              description: 'PDF downloaded successfully.'
            });
          }
        } catch (emailError) {
          console.error('Error sending PDF via email:', emailError);
          toast({
            title: 'PDF Downloaded',
            description: 'Email delivery could not be completed at this time.'
          });
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Could not generate PDF confirmation. Please try the download button.',
        variant: 'destructive'
      });
    } finally {
      setPdfGenerating(false);
    }
  };

  // Modified for specific manual download only
  const handleDownloadConfirmation = async () => {
    try {
      const pdfBytes = await generatePdf();
      downloadPdf(pdfBytes);
      
      toast({
        title: 'Success',
        description: 'PDF downloaded successfully'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF confirmation',
        variant: 'destructive'
      });
    }
  };
  
  // Helper function to download PDF
  const downloadPdf = (pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `TechEthica_Application_${registrationId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  };

  // Function to generate PDF - extracted from the main function for better organization
  const generatePdf = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a new page - A4 size (595 x 842 points) instead of A3 for faster processing
    const page = pdfDoc.addPage([595, 842]);
    
    // Get the standard font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set basic properties
    const textSize = 12;
    const titleSize = 20;
    const headerSize = 16;
    const margin = 40;
    const tableMargin = 50;
    const lineHeight = textSize * 1.7;
    
    // Use different colors based on theme
    const primaryColor = useLightTheme
      ? { r: 0.5, g: 0.3, b: 0.8 } // purple for light theme
      : { r: 0.85, g: 0.65, b: 0.13 }; // amber for dark theme
    
    // Simplified logo handling - skip logo loading to speed up PDF generation
    // Just use text header instead
    page.drawText('TechEthica Institute', {
      x: margin,
      y: page.getHeight() - margin - 40,
      size: 24,
      font: helveticaBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    // Set vertical positions
    const contentStartY = page.getHeight() - margin - 80;
    
    page.drawText('Application Confirmation', {
      x: margin,
      y: contentStartY,
      size: titleSize,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Add current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    page.drawText(`Date: ${currentDate}`, {
      x: margin,
      y: contentStartY - 30,
      size: textSize,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Registration ID box
    const refNumberY = contentStartY - 70;
    const boxHeight = 40;
    
    page.drawRectangle({
      x: margin - 10,
      y: refNumberY - boxHeight,
      width: 400,
      height: boxHeight,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      borderWidth: 1.5,
    });
    
    const boxCenterY = refNumberY - (boxHeight / 2);
    
    page.drawText('Application Reference Number:', {
      x: margin,
      y: boxCenterY - (textSize/2),
      size: textSize,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    page.drawText(registrationId, {
      x: margin + 200,
      y: boxCenterY - (textSize/2),
      size: textSize,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Student information section
    const studentInfoY = refNumberY - boxHeight - 50;
    
    page.drawText('Student Information', {
      x: margin,
      y: studentInfoY,
      size: headerSize,
      font: helveticaBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    page.drawLine({
      start: { x: margin, y: studentInfoY - 10 },
      end: { x: page.getWidth() - margin, y: studentInfoY - 10 },
      thickness: 1.5,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    // Format student data
    const fullName = [
      localStudentData.first_name || '',
      localStudentData.middle_name || '',
      localStudentData.last_name || ''
    ].filter(Boolean).join(' ') || 'Not provided';
    
    const cityStateCountry = [
      localStudentData.city || '',
      localStudentData.state || '',
      localStudentData.country || ''
    ].filter(Boolean).join(', ') || 'Not provided';

    // Build simplified table data focusing on core information
    const tableData = [
      { label: 'Full Name:', value: fullName },
      { label: 'Email:', value: localStudentData.email || 'Not provided' },
      { label: 'Phone:', value: localStudentData.phone || 'Not provided' },
      { label: 'Address:', value: localStudentData.address || 'Not provided' },
      { label: 'City, State, Country:', value: cityStateCountry },
      { label: 'Desired Program:', value: localStudentData.desired_academic_program || 'Not provided' },
      { label: 'Islamic Specialization:', value: localStudentData.islamic_studies_specialization || 'Not provided' },
      { label: 'Previous Education:', value: localStudentData.previous_education || 'Not provided' },
    ];
    
    // Simplified table drawing with fixed row height for faster processing
    const tableStartY = studentInfoY - 40;
    const tableWidth = page.getWidth() - (tableMargin * 2);
    const rowHeight = 30;
    const tableHeight = rowHeight * tableData.length;
    const labelColWidth = 170;
    
    // Draw table border
    page.drawRectangle({
      x: tableMargin,
      y: tableStartY - tableHeight,
      width: tableWidth,
      height: tableHeight,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
      color: rgb(1, 1, 1, 0), // Transparent fill
    });
    
    // Draw table rows with simplified approach
    tableData.forEach((row, index) => {
      const rowY = tableStartY - (index * rowHeight);
      const isEvenRow = index % 2 === 0;
      
      // Draw row background for even rows
      if (isEvenRow) {
        page.drawRectangle({
          x: tableMargin,
          y: rowY - rowHeight,
          width: tableWidth,
          height: rowHeight,
          color: rgb(0.95, 0.95, 0.95),
        });
      }
      
      // Draw horizontal line (except for the last row)
      if (index < tableData.length - 1) {
        page.drawLine({
          start: { x: tableMargin, y: rowY - rowHeight },
          end: { x: tableMargin + tableWidth, y: rowY - rowHeight },
          thickness: 0.5,
          color: rgb(0.8, 0.8, 0.8),
        });
      }
      
      // Draw vertical line between label and value
      page.drawLine({
        start: { x: tableMargin + labelColWidth, y: rowY },
        end: { x: tableMargin + labelColWidth, y: rowY - rowHeight },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
      
      // Draw label text (left column)
      page.drawText(row.label, {
        x: tableMargin + 10,
        y: rowY - (rowHeight/2) - (textSize/2),
        size: textSize,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      // Draw value text - simplified to show only one line
      page.drawText(row.value.slice(0, 50) + (row.value.length > 50 ? '...' : ''), {
        x: tableMargin + labelColWidth + 10,
        y: rowY - (rowHeight/2) - (textSize/2),
        size: textSize,
        font: helveticaFont,
        color: rgb(0.1, 0.1, 0.1),
      });
    });
    
    // Next steps section
    const nextStepsY = tableStartY - tableHeight - 40;
    
    page.drawText('Next Steps', {
      x: margin,
      y: nextStepsY,
      size: headerSize,
      font: helveticaBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    page.drawLine({
      start: { x: margin, y: nextStepsY - 10 },
      end: { x: page.getWidth() - margin, y: nextStepsY - 10 },
      thickness: 1,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    // Updated steps
    const steps = [
      'Upload the required documents through your application tracking page.',
      'Our team will review them within 5-7 business days.',
      'If eligible, you will be scheduled for an interview.',
      'Following the interview, you will receive a final decision.'
    ];
    
    steps.forEach((step, index) => {
      const y = nextStepsY - 40 - (index * lineHeight);
      
      page.drawText((index + 1) + '.', {
        x: margin,
        y: y,
        size: textSize,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      
      page.drawText(step, {
        x: margin + 20,
        y: y,
        size: textSize,
        font: helveticaFont,
        color: rgb(0.1, 0.1, 0.1),
      });
    });
    
    // Footer with centered text
    const footerY = 60;
    
    page.drawLine({
      start: { x: margin, y: footerY + 20 },
      end: { x: page.getWidth() - margin, y: footerY + 20 },
      thickness: 1,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    const footerText = 'TechEthica | Sunnah & Science Research Labs | admin@techethica.in | +91 95913 82400';
    const textWidth = helveticaFont.widthOfTextAtSize(footerText, textSize - 1);
    const centerX = (page.getWidth() - textWidth) / 2;
    
    page.drawText(footerText, {
      x: centerX,
      y: footerY,
      size: textSize - 1,
      font: helveticaFont,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    
    // Return the PDF bytes
    return await pdfDoc.save();
  };

  // Helper function to convert ArrayBuffer to base64 - optimized version
  const arrayBufferToBase64 = (buffer) => {
    // Use a more efficient method with TypedArray
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = bytes.byteLength;
    
    // Process in larger chunks
    const chunkSize = 4096; // Increased from 1024 for better performance
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.slice(i, Math.min(i + chunkSize, len));
      const binaryChunk = Array.from(chunk)
        .map(b => String.fromCharCode(b))
        .join('');
      binary += binaryChunk;
    }
    
    return window.btoa(binary);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <BackgroundPattern />

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className={`${cardBg} backdrop-blur-sm`}>
          <CardHeader>
            <div className="flex justify-center mb-6">
              <CheckCircle className={`w-16 h-16 ${iconColor}`} />
            </div>
            <CardTitle className={`text-2xl font-bold text-center ${headerText}`}>
              Application Submitted Successfully!
            </CardTitle>
            <CardDescription className={`text-center ${descriptionText} mt-2`}>
              Your application reference number:<br />
              <span className="font-mono font-bold text-lg">{registrationId}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Application Details */}
              <div className={`${sectionBg} rounded-lg p-6 backdrop-blur-sm border`}>
                <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Application Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="space-y-4">
                    <div>
                      <dt className={`${labelText} text-sm mb-1`}>Full Name</dt>
                      <dd className={`${valueText}`}>{[localStudentData.first_name, localStudentData.middle_name, localStudentData.last_name].filter(Boolean).join(' ') || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={`${labelText} text-sm mb-1`}>Program</dt>
                      <dd className={`${valueText}`}>{localStudentData.desired_academic_program || 'Not provided'}</dd>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <dt className={`${labelText} text-sm mb-1`}>Email</dt>
                      <dd className={`${valueText}`}>{localStudentData.email || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={`${labelText} text-sm mb-1`}>Specialization</dt>
                      <dd className={`${valueText}`}>{localStudentData.islamic_studies_specialization || 'Not provided'}</dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps - UPDATED */}
              <div className={`${sectionBg} rounded-lg p-6 backdrop-blur-sm border`}>
                <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Next Steps</h3>
                <ul className={`space-y-4 ${valueText}`}>
                  <li className="flex items-start">
                    <FileText className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>Please upload the required documents through your application tracking page.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>Our team will review your documents within 5-7 business days.</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>If eligible, you will be scheduled for an interview.</span>
                  </li>
                  <li className="flex items-start">
                    <Phone className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>For any queries, contact our admissions office at admin@techethica.in</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button 
                  onClick={() => window.location.href = `/track-application?id=${registrationId}`}
                  className={`${buttonPrimary} transition-all duration-200`}
                >
                  Track Your Application
                </Button>
                <Button 
                  onClick={handleDownloadConfirmation}
                  className={`${buttonPrimary} transition-all duration-200`}
                  disabled={pdfGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {pdfGenerating ? 'Generating...' : 'Download PDF'}
                </Button>
                <Button 
                  onClick={() => window.location.href = '/course-catalog'}
                  className={`${buttonPrimary} transition-all duration-200`}
                >
                  Browse Courses
                </Button>
                <Button 
                  onClick={() => window.location.href = '/home_react'}
                  variant="outline"
                  className={`${buttonOutline} transition-all duration-200`}
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default RegistrationConfirmation;