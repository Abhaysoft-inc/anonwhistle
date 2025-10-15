'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaShieldAlt, 
  FaNetworkWired, 
  FaArrowLeft, 
  FaUser, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaFileAlt,
  FaBuilding,
  FaCalendarAlt,
  FaIdBadge,
  FaBell,
  FaCommentAlt,
  FaUserTie,
  FaClipboardList
} from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import FloatingPanicButton from '../../../components/FloatingPanicButton';

export default function ComplaintProgress() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id;
  const [walletAddress, setWalletAddress] = useState('0x1234...5678');
  const [activeTab, setActiveTab] = useState('timeline');

  // Mock complaint data with progress tracking
  const complaint = {
    id: complaintId || 'CMP-001',
    title: 'Bribery in License Department',
    description: 'Officer demanding bribe for routine license renewal. Multiple witnesses available and payment proof exists.',
    department: 'Road Transport Office',
    location: 'Mumbai Regional Transport Office',
    submittedDate: '2025-10-10',
    lastUpdated: '2025-10-15',
    status: 'Under Investigation',
    priority: 'high',
    officerAssigned: 'Inspector Sharma',
    estimatedResolution: '2025-11-10',
    progress: [
      {
        id: 1,
        status: 'Complaint Submitted',
        description: 'Your complaint has been successfully submitted and assigned a tracking ID.',
        timestamp: '2025-10-10 14:30',
        completed: true,
        officer: 'System',
        notes: 'Complaint registered with ID CMP-001'
      },
      {
        id: 2,
        status: 'Initial Review',
        description: 'Complaint is being reviewed by our preliminary assessment team.',
        timestamp: '2025-10-11 09:15',
        completed: true,
        officer: 'Officer Kumar',
        notes: 'Documents verified and categorized as high priority'
      },
      {
        id: 3,
        status: 'Evidence Collection',
        description: 'Investigation team is collecting and verifying evidence.',
        timestamp: '2025-10-12 11:20',
        completed: true,
        officer: 'Inspector Sharma',
        notes: 'Additional witnesses contacted for statements'
      },
      {
        id: 4,
        status: 'Investigation In Progress',
        description: 'Active investigation is underway with relevant authorities.',
        timestamp: '2025-10-15 16:45',
        completed: false,
        officer: 'Inspector Sharma',
        notes: 'Currently interviewing department officials'
      },
      {
        id: 5,
        status: 'Resolution',
        description: 'Final resolution and action taken will be communicated.',
        timestamp: 'Pending',
        completed: false,
        officer: 'TBD',
        notes: 'Awaiting investigation completion'
      }
    ],
    evidence: [
      { id: 1, name: 'Receipt_001.pdf', type: 'Payment Proof', size: '2.4 MB', uploaded: '2025-10-10' },
      { id: 2, name: 'Audio_Recording.mp3', type: 'Audio Evidence', size: '5.2 MB', uploaded: '2025-10-10' },
      { id: 3, name: 'Witness_Statement.pdf', type: 'Document', size: '1.8 MB', uploaded: '2025-10-11' }
    ],
    updates: [
      {
        id: 1,
        message: 'Investigation team has been assigned to your case.',
        timestamp: '2025-10-12 14:30',
        type: 'info'
      },
      {
        id: 2,
        message: 'Additional evidence has been requested from the department.',
        timestamp: '2025-10-14 10:15',
        type: 'warning'
      },
      {
        id: 3,
        message: 'Progress update: Key witness interview completed.',
        timestamp: '2025-10-15 16:45',
        type: 'success'
      }
    ]
  };

  const handleLogout = () => {
    router.push('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Investigation':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending Review':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/my-complaints">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FaArrowLeft className="text-lg" />
                  <span className="text-sm font-medium">Back to My Complaints</span>
                </button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-900">AnonWhistle</span>
                  <span className="text-sm text-gray-500 ml-2">Complaint Progress</span>
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
          {/* Complaint Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                    {complaint.id}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded border ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded border capitalize ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} Priority
                  </span>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
                <p className="text-gray-600 mb-4">{complaint.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-400" />
                    <span className="text-gray-600">{complaint.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-gray-600">Submitted: {complaint.submittedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-gray-400" />
                    <span className="text-gray-600">Assigned: {complaint.officerAssigned}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-600 font-medium mb-1">Expected Resolution</div>
                  <div className="text-lg font-bold text-blue-800">{complaint.estimatedResolution}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'timeline'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaClipboardList className="inline mr-2" />
                  Progress Timeline
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'evidence'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaFileAlt className="inline mr-2" />
                  Evidence
                </button>
                <button
                  onClick={() => setActiveTab('updates')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'updates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaBell className="inline mr-2" />
                  Updates
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  {complaint.progress.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : index === complaint.progress.findIndex(s => !s.completed)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <FaCheckCircle className="text-lg" />
                          ) : index === complaint.progress.findIndex(s => !s.completed) ? (
                            <FaClock className="text-lg" />
                          ) : (
                            <FaClock className="text-lg" />
                          )}
                        </div>
                        {index < complaint.progress.length - 1 && (
                          <div className={`w-px h-16 ml-5 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${
                            step.completed ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {step.status}
                          </h3>
                          <span className="text-sm text-gray-500">{step.timestamp}</span>
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Officer: {step.officer}</span>
                          <span>•</span>
                          <span>{step.notes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence Tab */}
              {activeTab === 'evidence' && (
                <div className="space-y-4">
                  {complaint.evidence.map(file => (
                    <div key={file.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaFileAlt className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{file.type}</span>
                            <span>{file.size}</span>
                            <span>Uploaded: {file.uploaded}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEye />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div className="space-y-4">
                  {complaint.updates.map(update => (
                    <div key={update.id} className={`border rounded-lg p-4 ${getUpdateTypeColor(update.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FaCommentAlt className="mt-1" />
                          <div>
                            <p className="font-medium">{update.message}</p>
                            <span className="text-sm opacity-75">{update.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Panic Button */}
      <FloatingPanicButton />
    </div>
  );
}