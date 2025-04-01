// DocumentUpload.jsx
import React, { useState } from 'react';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Eye, RotateCw, X } from 'lucide-react';

const DocumentUpload = ({ document, registrationId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState(document.status === 'Submitted' ? 'view' : 'upload');
  
  const { call: uploadDocument } = useFrappePostCall('labmanager.api.api.upload_application_document');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // File size validation (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Convert file to base64 string for API call
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64String = e.target.result.split(',')[1]; // Remove data URL part

          // Call API to upload document with base64 encoded file
          console.log('Uploading document:', {
            registration_id: registrationId,
            document_type: document.document_type,
            filename: file.name
          });
          
          const response = await uploadDocument({
            registration_id: registrationId,
            document_type: document.document_type,
            file_data: base64String,
            filename: file.name
          });
          
          console.log('Upload response:', response);
          
          // Check for response success - Frappe wraps responses in message property
          if (response && response.message) {
            // The message itself could be an object with status or a string
            if (typeof response.message === 'object' && response.message.status === "success") {
              // Update local view mode immediately
              setViewMode('view');
              
              // Update local document status and date
              document.status = 'Submitted';
              document.submitted_date = new Date().toISOString().split('T')[0];
              
              // Notify parent component
              onUploadSuccess(document.document_type);
            } else if (typeof response.message === 'string' && response.message.includes('success')) {
              // Update local view mode immediately
              setViewMode('view');
              
              // Update local document status and date
              document.status = 'Submitted';
              document.submitted_date = new Date().toISOString().split('T')[0];
              
              // Notify parent component
              onUploadSuccess(document.document_type);
            } else {
              // Handle error from API response
              const errorMessage = 
                (typeof response.message === 'object' && response.message.message)
                ? response.message.message 
                : (typeof response.message === 'string' ? response.message : 'Upload failed');
              setError(errorMessage);
            }
          } else {
            setError('Invalid response from server');
          }
        } catch (error) {
          console.error('Document upload error:', error);
          setError('An error occurred during upload');
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setIsUploading(false);
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Document upload error:', error);
      setError('An error occurred during upload');
      setIsUploading(false);
    }
  };
  
  const handleReplace = async () => {
    try {
      setError(null);
      console.log('Replacing document:', document.document_type);
      
      // Call the API to delete the current document
      const response = await fetch(`/api/method/labmanager.api.api.delete_application_document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registrationId,
          document_type: document.document_type
        })
      });
      
      const result = await response.json();
      console.log('Replace response:', result);
      
      if (result.message) {
        // Update local state to show the upload form immediately
        setViewMode('upload');
        
        // Reset file state
        setFile(null);
        
        // Keep the current tab selected when calling parent callback
        if (onUploadSuccess) {
          onUploadSuccess(document.document_type, true);
        }
      } else {
        setError('Failed to delete the document');
      }
    } catch (error) {
      console.error('Error replacing document:', error);
      setError('An error occurred while trying to replace the document');
    }
  };
  
  // Render different UI based on document status
  const renderStatusBadge = () => {
    switch(document.status) {
      case 'Submitted':
        return <Badge className="bg-emerald-600 text-white">Submitted</Badge>;
      case 'Requested':
        return <Badge className="bg-amber-600 text-white">Requested</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">Pending</Badge>;
    }
  };
  
  return (
    <div className="bg-sky-100 rounded-lg p-4 border border-sky-200 shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-800">{document.document_type}</h4>
        {renderStatusBadge()}
      </div>
      
      {document.status === 'Rejected' && (
        <div className="bg-red-900/20 text-red-300 p-3 rounded-md mb-3 text-sm">
          <AlertCircle className="w-4 h-4 inline-block mr-2" />
          Reason: {document.rejection_reason || 'Document does not meet requirements'}
        </div>
      )}
      
      {viewMode === 'view' ? (
        // View mode for submitted documents
        <div className="bg-sky-100/50 p-3 rounded-md border border-sky-200 shadow-md text-sm flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-amber-500" />
            <span className="text-gray-700">Document submitted on {document.submitted_date}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 border-amber-300 text-amber-700 bg-white"
            onClick={handleReplace}
          >
            <RotateCw className="w-3 h-3 mr-1" /> Replace
          </Button>
        </div>
      ) : (
        // Upload mode
        <>
          <p className="text-sm text-gray-800 mb-3">{document.notes || `Please upload your ${document.document_type.toLowerCase()}`}</p>
          <div className="flex gap-2 mt-2">
            <Input 
              type="file" 
              id={`file-${document.document_type.replace(/\s+/g, '-').toLowerCase()}`} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
              onChange={handleFileChange}
            />
            <label 
              htmlFor={`file-${document.document_type.replace(/\s+/g, '-').toLowerCase()}`} 
              className="cursor-pointer bg-gray-700 text-amber-300 px-3 py-2 rounded-md hover:bg-gray-600 flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </label>
            <Button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="bg-amber-300 text-gray-900 hover:bg-amber-400"
            >
              {isUploading ? 
                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 
                <><CheckCircle className="w-4 h-4 mr-2" /> Submit</>
              }
            </Button>
          </div>
          
          {file && (
            <div className="mt-2 text-sm text-grey-800">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}
          
          {error && (
            <div className="mt-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 inline-block mr-1" />
              {error}
            </div>
          )}
        </>
      )}
      
      {document.deadline && (
        <div className="text-xs text-amber-300/70 mt-3 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Deadline: {document.deadline}
        </div>
      )}
      
      {/* Document Preview Modal */}
      {showPreview && document.file_url && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-amber-300">{document.document_type}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-white rounded">
              <iframe src={document.file_url} className="w-full h-full min-h-[500px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;