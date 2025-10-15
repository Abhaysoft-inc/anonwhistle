'use client';

import React, { useState } from 'react';
import { AuthSession, EvidenceRecord, SearchFilters } from '@/types';

interface SearchInterfaceProps {
  session: AuthSession;
  onResults: (results: EvidenceRecord[]) => void;
  onViewDetails: (evidence: EvidenceRecord) => void;
}

export default function SearchInterface({ session, onResults, onViewDetails }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EvidenceRecord[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: query.trim(),
          topK: 20,
          filters: {
            category: filters.category || undefined,
            location: filters.location || undefined,
            dateFrom: filters.dateFrom?.toISOString() || undefined,
            dateTo: filters.dateTo?.toISOString() || undefined,
            tags: filters.tags || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
      onResults(data.results || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
    setResults([]);
    setError(null);
    onResults([]);
  };

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

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Semantic Evidence Search
        </h3>
        
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
                placeholder="Enter search terms (e.g., 'harassment case', 'financial fraud', 'safety violation')"
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

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="harassment">Harassment</option>
                <option value="fraud">Fraud</option>
                <option value="discrimination">Discrimination</option>
                <option value="safety">Safety</option>
                <option value="privacy">Privacy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                placeholder="Department or location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom?.toISOString().split('T')[0] || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo?.toISOString().split('T')[0] || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateTo: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {(query || Object.values(filters).some(Boolean)) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearSearch}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Search
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
              <div key={result.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getCategoryColor(result.category)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                        {result.category || 'Uncategorized'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.uploadDate.toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2">{result.summary}</h4>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
                  <p className="font-medium mb-1">Evidence Extract:</p>
                  <p>{result.fullText}</p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {result.location && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        📍 {result.location}
                      </span>
                    )}
                    {result.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                    {result.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{result.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onViewDetails(result)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && !isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg">No matching evidence found</p>
            <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Search Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use natural language queries like "workplace harassment" or "financial misconduct"</li>
            <li>• Combine filters to narrow down results by category, location, or date range</li>
            <li>• The system uses AI to find semantically similar content, not just keyword matches</li>
            <li>• All search activities are logged for audit purposes</li>
          </ul>
        </div>
      )}
    </div>
  );
}