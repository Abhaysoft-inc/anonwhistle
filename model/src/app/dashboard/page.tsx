'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSession, EvidenceRecord, PaginatedResponse } from '@/types';
import Sidebar from '@/components/Sidebar';
import EvidenceTable from '@/components/EvidenceTable';
import SearchInterface from '@/components/SearchInterface';
import EvidenceModal from '@/components/EvidenceModal';

type TabType = 'overview' | 'search' | 'analytics';

export default function DashboardPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [evidenceData, setEvidenceData] = useState<PaginatedResponse<EvidenceRecord> | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (session && activeTab === 'overview') {
      loadEvidenceData();
    }
  }, [session, activeTab]);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setSession(data.session);
    } catch (err) {
      console.error('Session check failed:', err);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvidenceData = async (page: number = 1) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/data/all?page=${page}&limit=20`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load evidence data');
      }

      const data = await response.json();
      setEvidenceData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.push('/login');
    }
  };

  const handleSearchResults = (results: EvidenceRecord[]) => {
    setEvidenceData({
      data: results,
      total: results.length,
      page: 1,
      limit: results.length,
      hasNext: false,
      hasPrev: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        session={session}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'overview' && 'Evidence Overview'}
                  {activeTab === 'search' && 'Evidence Search'}
                  {activeTab === 'analytics' && 'Analytics & Insights'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {session.name} • {session.department}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {session.role.charAt(0).toUpperCase() + session.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                        📊
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Evidence Records
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {evidenceData?.total || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                        🔍
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          High Confidence Cases
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {evidenceData?.data.filter(item => item.confidence > 0.9).length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-500 text-white">
                        ⚠️
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Recent Submissions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {evidenceData?.data.filter(item => {
                            const dayAgo = new Date();
                            dayAgo.setDate(dayAgo.getDate() - 7);
                            return item.uploadDate > dayAgo;
                          }).length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Table */}
              <EvidenceTable
                data={evidenceData}
                onViewDetails={setSelectedEvidence}
                onPageChange={loadEvidenceData}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <SearchInterface
              session={session}
              onResults={handleSearchResults}
              onViewDetails={setSelectedEvidence}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Analytics & Insights
              </h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-gray-500">Analytics dashboard coming soon...</p>
                <p className="text-sm text-gray-400 mt-2">
                  This will include trend analysis, pattern detection, and automated insights.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Evidence Modal */}
      {selectedEvidence && (
        <EvidenceModal
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}