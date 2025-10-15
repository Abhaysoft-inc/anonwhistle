'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import EvidenceSearch from '@/components/EvidenceSearch';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleUploadComplete = (result: any) => {
    setUploadedFiles(prev => [...prev, result]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Anonymous Complaint Filing System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Secure complaint submission with AI-powered text extraction and search
              </p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/analysis"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                🧠 AI Analysis
              </Link>
              <Link 
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                🔒 Official Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📁 Upload Evidence
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 Search Evidence
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <div>
      

          <FileUpload onUploadComplete={handleUploadComplete} />
          
          {/* Recently Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Recently Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.slice().reverse().map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{file.filename}</p>
                      <p className="text-sm text-gray-600">File ID: {file.fileId}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Processed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <EvidenceSearch />
        </div>
      )}

      {/* Environment Variables Setup Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Environment Setup Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Make sure to set the following environment variables:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><code className="bg-yellow-100 px-1 rounded">OPENAI_API_KEY</code> - Your OpenAI API key</li>
                <li><code className="bg-yellow-100 px-1 rounded">PINECONE_API_KEY</code> - Your Pinecone API key</li>
                <li><code className="bg-yellow-100 px-1 rounded">PINECONE_ENVIRONMENT</code> - Your Pinecone environment</li>
                <li><code className="bg-yellow-100 px-1 rounded">PINECONE_INDEX</code> - Your Pinecone index name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}