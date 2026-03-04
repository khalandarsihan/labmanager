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

const handleGenerateAndSendPdf = async () => {
  if (pdfGenerating || emailSending || emailSent) return;
  
  setPdfGenerating(true);
  try {
    // Generate the PDF
    const pdfBytes = await generatePdf();
    
    // Convert the PDF bytes to base64
    const base64Pdf = arrayBufferToBase64(pdfBytes);
    
    // Download PDF locally without showing any toast
    downloadPdf(pdfBytes);
    
    // Only send email if we have a valid email and registration ID
    // No toast messages at all
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
        
        // Just log the response for debugging
        console.log('Email API response:', response);
        
        // Update state if successful
        if (response && response.status === 'success') {
          setEmailSent(true);
        }
      } catch (emailError) {
        // Just log the error
        console.error('Email sending error:', emailError);
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Only show a toast for critical PDF generation errors
    toast({
      title: 'Error',
      description: 'Could not generate PDF. Please try again.',
      variant: 'destructive'
    });
  } finally {
    setPdfGenerating(false);
  }
};

// Also update the downloadPdf function to remove any toast message there
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
  
  // No toast message here
};

// Also check for and remove any toast message in handleDownloadConfirmation
const handleDownloadConfirmation = async () => {
  try {
    const pdfBytes = await generatePdf();
    downloadPdf(pdfBytes);
    
    // No toast message here
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Only keep critical error toasts
    toast({
      title: 'Error',
      description: 'Failed to generate PDF. Please try again.',
      variant: 'destructive'
    });
  }
};
  

const generatePdf = async () => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Switch back to A3 size (842 x 1191 points) for more space
  const page = pdfDoc.addPage([842, 1191]);
  
  // Get the standard font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set basic properties
  const textSize = 14;
  const titleSize = 24;
  const headerSize = 18;
  const margin = 50;
  const tableMargin = 60;
  const lineHeight = textSize * 1.7;
  
  // Use different colors based on theme
  const primaryColor = useLightTheme
    ? { r: 0.5, g: 0.3, b: 0.8 } // purple for light theme
    : { r: 0.85, g: 0.65, b: 0.13 }; // amber for dark theme
  
  // Try to fetch and embed the logo
  let logoHeight = 0;
  try {
    // Try different paths for the logo
    const logoUrls = [
      '/assets/labmanager/images/techethica_letterhead.jpeg',
      '/files/logo.jpeg',
      '/assets/images/logo.jpeg',
      '/public/images/logo.jpeg',
      '/images/logo.jpeg',
      'labmanager/public/images/logo.jpeg'
    ];
    
    let logoBytes = null;
    let successUrl = null;
    
    for (const url of logoUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          logoBytes = await response.arrayBuffer();
          successUrl = url;
          break;
        }
      } catch (err) {
        console.log(`Logo not found at ${url}`);
      }
    }
    
    if (logoBytes) {
      const logo = await pdfDoc.embedJpg(logoBytes);
      
      // Calculate logo dimensions (maintaining aspect ratio)
      const logoWidth = page.getWidth() * 0.9; // 90% of page width for a letterhead style
      logoHeight = (logo.height / logo.width) * logoWidth;
      
      // Draw the logo
      page.drawImage(logo, {
        x: (page.getWidth() - logoWidth) / 2,  // This centers the logo horizontally
        y: page.getHeight() - margin - logoHeight,
        width: logoWidth,
        height: logoHeight,
      });

      console.log(`Logo successfully loaded from ${successUrl}`);
    } 
    else {
      throw new Error('No logo found at any expected path');
    }
  } catch (logoError) {
    console.warn('Logo loading failed, continuing without logo:', logoError);
    // Fallback to text-only header if logo fails to load
    page.drawText('TechEthica Institute', {
      x: margin,
      y: page.getHeight() - margin - 40,
      size: 24,
      font: helveticaBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });
    logoHeight = 40;
  }
  
  // Adjust vertical positions to account for logo
  const contentStartY = page.getHeight() - margin - logoHeight - 40;
  
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
    y: contentStartY - 35,
    size: textSize,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  // Registration ID box
  const refNumberY = contentStartY - 80;
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
  const studentInfoY = refNumberY - boxHeight - 60;
  
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
  
  // Format student data with better handling of optional fields
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

  // Build table data with all required fields
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
  
  // Calculate row heights and total table height
  const labelColWidth = 170;
  const valueColWidth = page.getWidth() - tableMargin * 2 - labelColWidth;
  const rowHeight = 40; // Increased row height
  const tableHeight = rowHeight * tableData.length;
  
  const tableStartY = studentInfoY - 40;
  const tableWidth = page.getWidth() - (tableMargin * 2);
  
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
  
  // Draw table rows
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
    
    // Draw value text
    page.drawText(row.value, {
      x: tableMargin + labelColWidth + 10,
      y: rowY - (rowHeight/2) - (textSize/2),
      size: textSize,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.1),
    });
  });
  
  // Next steps section - Ensure enough space after the table
  const nextStepsY = tableStartY - tableHeight - 60;
  
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
  
  // Updated steps to match new workflow
  const steps = [
    'Upload the required documents through your application tracking page.',
    'Our team will review them within 5-7 business days.',
    'If eligible, you will be scheduled for an interview.',
    'Following the interview, you will receive a final decision on your application.'
  ];
  
  steps.forEach((step, index) => {
    const y = nextStepsY - 40 - (index * lineHeight * 1.3);
    
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
  
  // Add more space before the footer to ensure no overlap
  const footerY = 80;

  // Draw the line above the footer
  page.drawLine({
    start: { x: margin, y: footerY + 20 },
    end: { x: page.getWidth() - margin, y: footerY + 20 },
    thickness: 1,
    color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
  });

  // Centered footer text with updated information
  const footerText = 'TechEthica | Sunnah & Science Research Labs | admin@techethica.in | +91 93801 31600';
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