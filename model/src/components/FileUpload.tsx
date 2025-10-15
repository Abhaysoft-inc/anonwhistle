'use client';

import React, { useState, useCallback } from 'react';
import { UploadProgress, FileMetadata } from '@/types';

interface FileUploadProps {
  onUploadComplete?: (result: any) => void;
}

// Complaint categories for the dropdown
const COMPLAINT_CATEGORIES = [
  'Workplace',
  'Harassment',
  'Discrimination', 
  'Corruption',
  'Safety Violation',
  'Policy Violation',
  'Financial Misconduct',
  'Other'
];

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Complaint form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleFileUpload = useCallback(async (files: FileList) => {
    // Validate required fields
    if (!title.trim()) {
      alert('Please provide a complaint title before uploading files.');
      return;
    }
    
    if (!category) {
      alert('Please select a complaint category before uploading files.');
      return;
    }

    const newUploads: UploadProgress[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];
      const uploadIndex = uploads.length + i;

      try {
        // Update status to extracting
        setUploads(prev => prev.map((item, idx) => 
          idx === uploadIndex ? { ...item, status: 'extracting', progress: 25 } : item
        ));

        const formData = new FormData();
        formData.append('file', upload.file);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);

        // Update status to embedding
        setUploads(prev => prev.map((item, idx) => 
          idx === uploadIndex ? { ...item, status: 'embedding', progress: 50 } : item
        ));

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        // Update status to completed
        setUploads(prev => prev.map((item, idx) => 
          idx === uploadIndex ? { ...item, status: 'completed', progress: 100 } : item
        ));

        onUploadComplete?.(result);

      } catch (error) {
        setUploads(prev => prev.map((item, idx) => 
          idx === uploadIndex ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error',
            progress: 0 
          } : item
        ));
      }
    }
  }, [uploads.length, title, category, description, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== 'completed'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Complaint Information Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Complaint Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your complaint"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {COMPLAINT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context or details about your complaint..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop your evidence files here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.doc,.docx"
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Choose Files
          </label>
          <p className="text-xs text-gray-500">
            Supported: PDF, Images (JPG, PNG, GIF, WebP), Text files, Word documents
            <br />
            Maximum file size: 10MB
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upload Progress</h3>
            <button
              onClick={clearCompleted}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Completed
            </button>
          </div>
          
          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {upload.file.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(upload.status)}`}>
                    {upload.status}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      upload.status === 'error' ? 'bg-red-500' : 
                      upload.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>

                {upload.error && (
                  <p className="text-red-600 text-xs mt-1">{upload.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: UploadProgress['status']) {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-700';
    case 'extracting': return 'bg-yellow-100 text-yellow-700';
    case 'embedding': return 'bg-blue-100 text-blue-700';
    case 'storing': return 'bg-purple-100 text-purple-700';
    case 'completed': return 'bg-green-100 text-green-700';
    case 'error': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}