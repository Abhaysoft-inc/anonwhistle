'use client';

import React from 'react';
import { EvidenceRecord } from '@/types';
import { anonymizeEvidenceText } from '@/lib/dataAccess';

interface EvidenceModalProps {
  evidence: EvidenceRecord;
  onClose: () => void;
}

export default function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'harassment': return 'bg-red-100 text-red-800 border-red-200';
      case 'fraud': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'discrimination': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'safety': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'privacy': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Anonymize the full text before display
  const anonymizedText = anonymizeEvidenceText(evidence.fullText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Evidence Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Record ID: {evidence.id} • File ID: {evidence.fileId}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(evidence.category)}`}>
                      {evidence.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900">{evidence.location || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Upload Date</label>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900">
                      {evidence.uploadDate.toLocaleDateString()} at {evidence.uploadDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Confidence Score</label>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            evidence.confidence >= 0.8 ? 'bg-green-500' :
                            evidence.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${evidence.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 font-medium">
                        {Math.round(evidence.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">File Type</label>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900">{evidence.metadata?.fileType || 'Unknown'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {evidence.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {evidence.tags.length === 0 && (
                      <span className="text-sm text-gray-400">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-500">Summary</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-900">{evidence.summary}</p>
              </div>
            </div>

            {/* Full Text (Anonymized) */}
            <div>
              <label className="text-sm font-medium text-gray-500">Full Evidence Text (Anonymized)</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-md border max-h-64 overflow-y-auto">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {anonymizedText}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                ⚠️ Personally identifiable information has been automatically redacted for privacy protection.
              </p>
            </div>

            {/* Additional Metadata */}
            {evidence.metadata && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Additional Metadata</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {evidence.metadata.filename && (
                    <div>
                      <span className="font-medium text-gray-700">Original Filename:</span>
                      <p className="text-gray-600 break-all">{evidence.metadata.filename}</p>
                    </div>
                  )}
                  {evidence.metadata.complaintType && (
                    <div>
                      <span className="font-medium text-gray-700">Complaint Type:</span>
                      <p className="text-gray-600">{evidence.metadata.complaintType}</p>
                    </div>
                  )}
                  {evidence.metadata.incidentDate && (
                    <div>
                      <span className="font-medium text-gray-700">Incident Date:</span>
                      <p className="text-gray-600">{evidence.metadata.incidentDate}</p>
                    </div>
                  )}
                  {evidence.metadata.uploadedAt && (
                    <div>
                      <span className="font-medium text-gray-700">Upload Timestamp:</span>
                      <p className="text-gray-600">{new Date(evidence.metadata.uploadedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={() => {
                // In production, this would generate a secure report
                alert('Export functionality would be implemented here with proper audit logging.');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}