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
  const { call: sendPdfEmail } = useFrappePostCall('labmanager.api.api.send_registration_pdf');

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

  // Auto-download PDF when component mounts
  useEffect(() => {
    if (registrationId && localStudentData && Object.keys(localStudentData).length > 0) {
      // Trigger download after a short delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        handleDownloadConfirmation(false, true); // Direct download when page loads and also email the PDF
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [registrationId, localStudentData]);

  // Apply theme-based styles
  const cardBg = useLightTheme 
  ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
  : "border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444]"
    
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

  const handleDownloadConfirmation = async (openInNewTab = false, sendEmail = false) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add a new page - A3 size (842 x 1191 points)
      const page = pdfDoc.addPage([842, 1191]); // A3 size in portrait
      
      // Get the standard font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Set basic properties
      const textSize = 11;
      const titleSize = 18;
      const headerSize = 14;
      const margin = 50;
      const tableMargin = 60;
      const lineHeight = textSize * 1.5;
      
      // Use different colors based on theme
      const primaryColor = useLightTheme
        ? { r: 0.5, g: 0.3, b: 0.8 } // purple for light theme
        : { r: 0.85, g: 0.65, b: 0.13 }; // amber for dark theme
      
      // Try to fetch and embed the logo
      let logoHeight = 0;
      try {
        // Try different paths for the logo
        const logoUrls = [
          '/assets/labmanager/images/logo.jpeg', 
          '/files/logo.jpeg',                   // fallback if uploaded via File Doctype
          '/assets/images/logo.jpeg',           // fallback if you move it to frappe's public/images
          // '/public/images/logo.jpeg',
          // '/images/logo.jpeg',
          // 'labmanager/public/images/logo.jpeg'
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
          const logoWidth = 160; // Increased for A3 page
          logoHeight = (logo.height / logo.width) * logoWidth;
          
          // Draw the logo
          page.drawImage(logo, {
            x: margin,
            y: page.getHeight() - margin - logoHeight,
            width: logoWidth,
            height: logoHeight,
          });
          
          // Draw institution name next to logo
          page.drawText('TechEthica Institute', {
            x: margin + logoWidth + 20,
            y: page.getHeight() - margin - (logoHeight / 2) + 10,
            size: 24,
            font: helveticaBold,
            color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
          });
          
          console.log(`Logo successfully loaded from ${successUrl}`);
        } else {
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
      const contentStartY = page.getHeight() - margin - 100; // Moved down to account for logo
      
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
      
      // Add reference number with background
      const refNumberY = contentStartY - 60;
      
      // Draw ref number box
      page.drawRectangle({
        x: margin - 10,
        y: refNumberY - 10,
        width: 400,
        height: 40,
        color: rgb(0.95, 0.95, 0.95),
        borderColor: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
        borderWidth: 1,
      });
      
      page.drawText('Application Reference Number:', {
        x: margin,
        y: refNumberY + 10,
        size: textSize,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      page.drawText(registrationId, {
        x: margin + 200,
        y: refNumberY + 10,
        size: textSize + 2,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      
      // Student information section
      const studentInfoY = refNumberY - 60;
      
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
        thickness: 1,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      
      // Format data for the table
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
      
      // Function to handle potential text wrapping for long values
      const wrapText = (text, maxWidth, fontSize, font) => {
        if (!text) return [''];
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          const potentialLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(potentialLine, fontSize);
          
          if (width <= maxWidth) {
            currentLine = potentialLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      };
      
      // Function to calculate row height based on content
      const calculateRowHeight = (value, colWidth, fontSize, font) => {
        const lines = wrapText(value, colWidth - 20, fontSize, font); // 20px padding
        return Math.max(24, lines.length * (fontSize + 4)); // minimum 24px, or increase based on lines
      };
      
      // Reorganized table data in logical groups
      const tableData = [
        // Personal Information Group
        { label: 'Full Name:', value: fullName },
        { label: 'Email:', value: localStudentData.email || 'Not provided' },
        { label: 'Phone:', value: localStudentData.phone || 'Not provided' },
        { label: 'Date of Birth:', value: localStudentData.date_of_birth || 'Not provided' },
        { label: 'Gender:', value: localStudentData.gender || 'Not provided' },
        
        // Address Information Group
        { label: 'Address:', value: localStudentData.address || 'Not provided' },
        { label: 'City, State, Country:', value: cityStateCountry },
        
        // Education Information Group (grouped logically)
        { label: 'Previous Education:', value: localStudentData.previous_education || 'Not provided' },
        { label: 'Year of Completion:', value: localStudentData.year_of_completion ? localStudentData.year_of_completion.toString() : 'Not provided' },
        { label: 'Institution:', value: localStudentData.institution || 'Not provided' },
        
        // Program Information Group
        { label: 'Desired Program:', value: localStudentData.desired_academic_program || 'Not provided' },
        { label: 'Islamic Studies Specialization:', value: localStudentData.islamic_studies_specialization || 'Not provided' }
      ];
      
      // Calculate dynamic row heights and total table height
      const labelColWidth = 170; // Reduced label column width
      const valueColWidth = page.getWidth() - tableMargin * 2 - labelColWidth;
      
      // Pre-calculate heights
      const rowHeights = tableData.map(row => 
        calculateRowHeight(row.value, valueColWidth, textSize, helveticaFont)
      );
      
      // Calculate cumulative row positions
      const rowPositions = [];
      let totalHeight = 0;
      rowHeights.forEach(height => {
        rowPositions.push(totalHeight);
        totalHeight += height;
      });
      
      const tableStartY = studentInfoY - 45;
      const tableWidth = page.getWidth() - (tableMargin * 2);
      const tableHeight = totalHeight;
      
      // Draw the table border
      page.drawRectangle({
        x: tableMargin,
        y: tableStartY - tableHeight,
        width: tableWidth,
        height: tableHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
        color: rgb(1, 1, 1, 0), // Transparent fill
      });
      
      // Draw table rows and handle text wrapping
      tableData.forEach((row, index) => {
        const rowHeight = rowHeights[index];
        const rowY = tableStartY - rowPositions[index];
        const isEvenRow = index % 2 === 0;
        
        // Draw row background for even rows
        if (isEvenRow) {
          page.drawRectangle({
            x: tableMargin,
            y: rowY - rowHeight,
            width: tableWidth,
            height: rowHeight,
            color: rgb(0.95, 0.95, 0.95), // Light gray background for even rows
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
          x: tableMargin + 10, // Add padding
          y: rowY - textSize - 8, // Position at top of cell with padding
          size: textSize,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });
        
        // Draw value text with potential wrapping (right column)
        const wrappedLines = wrapText(row.value, valueColWidth - 20, textSize, helveticaFont);
        wrappedLines.forEach((line, lineIndex) => {
          const lineY = rowY - textSize - 8 - (lineIndex * (textSize + 4));
          if (lineY > rowY - rowHeight + 4) { // Ensure text stays within row
            page.drawText(line, {
              x: tableMargin + labelColWidth + 10, // Add padding
              y: lineY,
              size: textSize,
              font: helveticaFont,
              color: rgb(0.1, 0.1, 0.1),
            });
          }
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
      
      const steps = [
        'Our admissions team will review your application within 5-7 business days.',
        'You will receive an email notification about your application status.',
        'For any queries, contact our admissions office at admissions@techethica.edu'
      ];
      
      steps.forEach((step, index) => {
        const y = nextStepsY - 40 - (index * lineHeight * 1.2);
        
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
      
      // Footer
      const footerY = 70;
      
      page.drawLine({
        start: { x: margin, y: footerY + 20 },
        end: { x: page.getWidth() - margin, y: footerY + 20 },
        thickness: 1,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      
      page.drawText('TechEthica Institute', {
        x: margin,
        y: footerY,
        size: textSize,
        font: helveticaBold,
        color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      });
      
      page.drawText('www.techethica.edu | +1 (555) 123-4567', {
        x: margin,
        y: footerY - 20,
        size: textSize - 2,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Create blob for PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      if (openInNewTab) {
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Open in new tab with proper download headers
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>TechEthica Application - ${registrationId}</title>
              </head>
              <body style="margin: 0;">
                <iframe src="${blobUrl}" style="border: none; width: 100%; height: 100vh;"></iframe>
              </body>
            </html>
          `);
          // Close the document to finish writing
          newTab.document.close();
        }
        
        // Clean up URL after delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 5000);
      } else {
        // Direct download
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
      }
      
      // If sendEmail is true and we haven't sent an email yet, send the PDF via email
      if (sendEmail && !emailSent && localStudentData.email) {
        try {
          // Convert PDF bytes to base64 string for sending
          const base64Pdf = arrayBufferToBase64(pdfBytes);
          
          // Log the size of the PDF data to help with debugging
          console.log(`PDF data size: ${Math.round(base64Pdf.length / 1024)} KB`);
          
          // Send the email using the API with a longer timeout
          const response = await Promise.race([
            sendPdfEmail({
              registration_id: registrationId,
              email: localStudentData.email,
              pdf_data: base64Pdf,
              first_name: localStudentData.first_name || '',
              last_name: localStudentData.last_name || ''
            }),
            // Set a timeout to handle potential hanging requests
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email request timed out')), 30000)
            )
          ]);
          
          if (response?.status === 'success') {
            setEmailSent(true);
            toast({
              title: 'Success',
              description: 'PDF confirmation also sent to your email'
            });
          } else {
            console.error('Email sending failed:', response?.message);
            // Silent failure - don't show error toast to avoid disrupting user experience
            // But log it for debugging purposes
            frappe.log_error(`Email sending failed: ${JSON.stringify(response)}`, 'PDF Email Error');
          }
        } catch (emailError) {
          console.error('Error sending PDF via email:', emailError);
          
          // Make a simpler fallback attempt with smaller PDF if it failed
          try {
            // Try sending without the PDF if the first attempt fails
            const fallbackResponse = await sendPdfEmail({
              registration_id: registrationId,
              email: localStudentData.email,
              pdf_data: null, // Skip the PDF
              first_name: localStudentData.first_name || '',
              last_name: localStudentData.last_name || ''
            });
            
            if (fallbackResponse?.status === 'success') {
              setEmailSent(true);
              // Don't show toast to avoid confusion about the missing PDF
            }
          } catch (fallbackError) {
            console.error('Fallback email sending failed:', fallbackError);
          }
        }
      }
      
      if (!sendEmail) {
        toast({
          title: 'Success',
          description: openInNewTab ? 'PDF opened in new tab' : 'PDF downloaded successfully'
        });
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF confirmation',
        variant: 'destructive'
      });
    }
  };

  // Helper function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    // Process in chunks to avoid memory issues with large PDFs
    const chunkSize = 1024;
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.slice(i, Math.min(i + chunkSize, len));
      for (let j = 0; j < chunk.length; j++) {
        binary += String.fromCharCode(chunk[j]);
      }
    }
    
    return window.btoa(binary);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Use the BackgroundPattern component instead of hard-coded background */}
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

              {/* Next Steps */}
              <div className={`${sectionBg} rounded-lg p-6 backdrop-blur-sm border`}>
                <h3 className={`text-lg font-semibold ${headerText} mb-4`}>Next Steps</h3>
                <ul className={`space-y-4 ${valueText}`}>
                  <li className="flex items-start">
                    <FileText className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>Our admissions team will review your application within 5-7 business days.</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>You will receive an email notification about your application status.</span>
                  </li>
                  <li className="flex items-start">
                    <Phone className={`w-5 h-5 mr-3 ${iconColor} mt-1 flex-shrink-0`} />
                    <span>For any queries, contact our admissions office at admissions@techethica.edu</span>
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
                  onClick={() => handleDownloadConfirmation(false)}
                  className={`${buttonPrimary} transition-all duration-200`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
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