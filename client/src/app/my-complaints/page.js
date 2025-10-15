'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShieldAlt, FaNetworkWired, FaArrowLeft, FaUser, FaSearch, FaEye, FaCalendarAlt, FaBuilding, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BiLogOut, BiRefresh } from 'react-icons/bi';
import FloatingPanicButton from '../../components/FloatingPanicButton';

export default function MyComplaints() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('0x1234...5678');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = () => {
    router.push('/');
  };

  // Mock complaints data
  const complaints = [
    {
      id: 'CMP-001',
      title: 'Bribery in License Department',
      department: 'Road Transport',
      status: 'Under Investigation',
      statusColor: 'yellow',
      date: '2025-10-10',
      priority: 'medium'
    },
    {
      id: 'CMP-002',
      title: 'Corruption in Public Works',
      department: 'Urban Development',
      status: 'Resolved',
      statusColor: 'green',
      date: '2025-09-25',
      priority: 'high'
    },
    {
      id: 'CMP-003',
      title: 'Illegal Road Blocking',
      department: 'Traffic Police',
      status: 'Pending Review',
      statusColor: 'orange',
      date: '2025-10-05',
      priority: 'low'
    }
  ];

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'resolved' && complaint.status === 'Resolved') ||
                         (filterStatus === 'pending' && complaint.status !== 'Resolved');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <FaCheckCircle className="text-green-600" />;
      case 'Under Investigation':
        return <FaExclamationTriangle className="text-yellow-600" />;
      default:
        return <FaClock className="text-orange-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FaArrowLeft className="text-lg" />
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-900">AnonWhistle</span>
                  <span className="text-sm text-gray-500 ml-2">My Complaints</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <FaNetworkWired className="text-green-600 text-sm" />
                <span className="text-green-700 text-sm font-medium">Secure Connection</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500 text-sm" />
                  <span className="text-gray-700 text-sm font-mono">{walletAddress}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
              >
                <BiLogOut className="text-lg" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Complaints</h1>
            <p className="text-gray-600">Track the progress of your submitted complaints</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search complaints by title, ID, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
                
                <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <BiRefresh className="text-lg" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Complaints Found</h3>
                <p className="text-gray-600">No complaints match your search criteria.</p>
              </div>
            ) : (
              filteredComplaints.map(complaint => (
                <div key={complaint.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          {complaint.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <span className="text-sm font-medium text-gray-900">{complaint.status}</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded border capitalize ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-gray-400" />
                          <span>{complaint.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{complaint.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/complaint-progress/${complaint.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                        <FaEye className="text-sm" />
                        <span className="text-sm font-medium">View Progress</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600 text-sm">Total Complaints</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">1</div>
              <div className="text-gray-600 text-sm">Resolved</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">2</div>
              <div className="text-gray-600 text-sm">In Progress</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Panic Button */}
      <FloatingPanicButton />
    </div>
  );
}