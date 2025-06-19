import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, File, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCompliance } from '../context/ComplianceContext';
import { redirect } from 'next/navigation';

const Upload = () => {
  const { t } = useLanguage();
  const { uploadDocument, validateDocument } = useCompliance();

  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (selectedFile: File) => {
    // Only accept PDF, DOC, DOCX files
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      alert(t('fileTypeError'));
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const removeFile = () => {
    setFile(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Upload the document
      const document = await uploadDocument(file);
      
      // Complete the progress bar
      clearInterval(interval);
      setUploadProgress(100);
      setUploadComplete(true);
      
      // Give time for animation to complete
      setTimeout(async () => {
        // Proceed to validate the document
        await validateDocument(document.id);
        
        // Navigate to the report page
        redirect(`/report/${document.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      clearInterval(interval);
      setIsUploading(false);
      alert(t('uploadError'));
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('uploadDocumentTitle')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('uploadDocumentDescription')}</p>
        </div>
        
        <div className="p-6">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-500">{t('dragAndDropText')}</p>
                <p className="mt-1 text-xs text-gray-500">{t('supportedFormats')}</p>
              </div>
              <div className="mt-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInputChange}
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('selectFile')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-4 flex items-start justify-between">
                <div className="flex items-center">
                  <File className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                {!isUploading && (
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {isUploading ? (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{uploadComplete ? t('uploadComplete') : t('uploading')}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  
                  {uploadComplete && (
                    <div className="flex items-center text-green-600 text-sm mt-2">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      {t('preparingValidation')}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('validateDocument')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('whatWeCheck')}</h3>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <ul className="space-y-4">
            {['checkIdentification', 'checkSalary', 'checkHours', 'checkBenefits', 'checkProbation', 'checkNonCompete'].map((item) => (
              <li key={item} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-sm text-gray-700">{t(item as any)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;