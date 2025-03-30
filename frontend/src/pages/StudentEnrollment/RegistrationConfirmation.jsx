import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Mail, Phone, Download } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Toast from './Toast';

const RegistrationConfirmation = ({ registrationId, studentData = {} }) => {
  // Toast state
  const [toast, setToast] = useState(null);
  const [localStudentData, setLocalStudentData] = useState(studentData || {});

  // Try to load data from localStorage if not provided via props
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

  const handleDownloadConfirmation = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add a new page
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      
      // Get the standard font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Set basic properties
      const textSize = 11;
      const titleSize = 18;
      const headerSize = 14;
      const margin = 50;
      const tableMargin = 60; // Slightly larger margin for the table
      const lineHeight = textSize * 1.5;
      
      // Draw school logo/header
      page.drawText('TechEthica Institute', {
        x: margin,
        y: page.getHeight() - margin,
        size: 24,
        font: helveticaBold,
        color: rgb(0.85, 0.65, 0.13), // amber color
      });
      
      page.drawText('Application Confirmation', {
        x: margin,
        y: page.getHeight() - margin - 40,
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
        y: page.getHeight() - margin - 70,
        size: textSize,
        font: helveticaFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      
      // Add reference number with background
      const refNumberY = page.getHeight() - margin - 110;
      
      // Draw ref number box
      page.drawRectangle({
        x: margin - 10,
        y: refNumberY - 10,
        width: 400,
        height: 40,
        color: rgb(0.95, 0.95, 0.95),
        borderColor: rgb(0.85, 0.65, 0.13),
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
        color: rgb(0.85, 0.65, 0.13),
      });
      
      page.drawLine({
        start: { x: margin, y: studentInfoY - 10 },
        end: { x: page.getWidth() - margin, y: studentInfoY - 10 },
        thickness: 1,
        color: rgb(0.85, 0.65, 0.13),
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
        color: rgb(0.85, 0.65, 0.13),
      });
      
      page.drawLine({
        start: { x: margin, y: nextStepsY - 10 },
        end: { x: page.getWidth() - margin, y: nextStepsY - 10 },
        thickness: 1,
        color: rgb(0.85, 0.65, 0.13),
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
        color: rgb(0.85, 0.65, 0.13),
      });
      
      page.drawText('TechEthica Institute', {
        x: margin,
        y: footerY,
        size: textSize,
        font: helveticaBold,
        color: rgb(0.85, 0.65, 0.13),
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
      
      // Trigger the browser to download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `TechEthica_Application_${registrationId}.pdf`);
      
      // Show success toast
      setToast({
        type: 'success',
        message: 'Confirmation PDF downloaded successfully'
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToast({
        type: 'error',
        message: 'Failed to generate PDF confirmation'
      });
    }
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
              <div className="bg-gray-700/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-semibold text-amber-300 mb-4">Application Details</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                  <div>
                    <dt className="text-gray-400 text-sm">Full Name</dt>
                    <dd>{[localStudentData.first_name, localStudentData.middle_name, localStudentData.last_name].filter(Boolean).join(' ') || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-sm">Email</dt>
                    <dd>{localStudentData.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-sm">Program</dt>
                    <dd>{localStudentData.desired_academic_program || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-sm">Specialization</dt>
                    <dd>{localStudentData.islamic_studies_specialization || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

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
                  onClick={() => window.location.href = '/home_react'}
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

      {/* Toast notifications */}
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};

export default RegistrationConfirmation;