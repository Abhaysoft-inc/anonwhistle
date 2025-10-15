'use client';

import React, { useState } from 'react';
import { SearchResult } from '@/types';

interface EvidenceSearchProps {
  onSearchResults?: (results: SearchResult[]) => void;
}

export default function EvidenceSearch({ onSearchResults }: EvidenceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          topK: 10,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
      onSearchResults?.(data.results || []);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setQuery('');
    setError(null);
    onSearchResults?.([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Search Evidence</h3>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your search query..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearResults}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Results
              </button>
            </div>
          )}
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results ({results.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{result.filename}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Score: {(result.score * 100).toFixed(1)}%</span>
                      <span>Type: {result.metadata.fileType}</span>
                      {result.metadata.uploadedAt && (
                        <span>
                          Uploaded: {new Date(result.metadata.uploadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-1">Extracted Text:</p>
                  <p>{result.text}</p>
                </div>

                {/* Metadata */}
                {(result.metadata.complaintType || result.metadata.location || result.metadata.tags) && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Metadata:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {result.metadata.complaintType && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Type: {result.metadata.complaintType}
                        </span>
                      )}
                      {result.metadata.location && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          Location: {result.metadata.location}
                        </span>
                      )}
                      {result.metadata.incidentDate && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          Date: {result.metadata.incidentDate}
                        </span>
                      )}
                      {result.metadata.tags && result.metadata.tags.length > 0 && (
                        result.metadata.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                            {tag}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {query && results.length === 0 && !isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg">No matching evidence found</p>
            <p className="text-sm mt-2">Try adjusting your search terms or upload more evidence files.</p>
          </div>
        </div>
      )}
    </div>
  );
}