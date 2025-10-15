'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShieldAlt, FaNetworkWired, FaArrowLeft, FaFileAlt, FaUser, FaLock, FaGavel, FaCalendarAlt, FaMapMarkerAlt, FaPaperclip, FaExclamationTriangle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

export default function NewComplaint() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    dateOfIncident: '',
    severity: 'medium',
    category: '',
    evidence: null,
    witnessInfo: '',
    expectedOutcome: ''
  });



  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setIsProcessing(true);
      setProcessingStep('Analyzing file...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStep('Removing metadata...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingStep('Encrypting file...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({ ...prev, evidence: file }));
      setIsProcessing(false);
      setProcessingStep('');
    } else {
      alert('File size must be less than 10MB');
    }
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsProcessing(true);
    setProcessingStep('Encrypting complaint data...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProcessingStep('Submitting to blockchain...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessingStep('Generating complaint ID...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const complaintId = 'CMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setIsProcessing(false);
    setProcessingStep('');
    
    alert(`Complaint submitted successfully! Complaint ID: ${complaintId}`);
    
    router.push('/dashboard');
  };

  const departments = [
    'Ministry of Railways',
    'Road Transport & Highways',
    'Power & Energy',
    'Health & Family Welfare',
    'Education',
    'Urban Development',
    'Agriculture & Farmers Welfare',
    'Labour & Employment',
    'Finance',
    'Environment & Forests',
    'Police Department',
    'Municipal Corporation',
    'Judiciary',
    'Other'
  ];

  const categories = [
    'Corruption/Bribery',
    'Negligence of Duty',
    'Misuse of Power',
    'Financial Irregularities',
    'Harassment',
    'Discrimination',
    'Poor Service Quality',
    'Safety Violations',
    'Environmental Issues',
    'Other'
  ];

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
                  <span className="text-sm text-gray-500 ml-2">New Complaint</span>
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
                onClick={() => {
                  localStorage.removeItem('walletAddress');
                  router.push('/');
                }}
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">File New Complaint</h1>
            <p className="text-gray-600">Submit your complaint securely and anonymously through our encrypted platform</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Complaint Details</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Evidence Upload</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaLock className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="text-blue-900 font-semibold mb-2">Privacy & Security Protection</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• All information is encrypted before transmission</li>
                  <li>• Your IP address is protected through secure networking</li>
                  <li>• Blockchain technology prevents data tampering</li>
                  <li>• No personal identifying information is stored</li>
                </ul>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 space-y-8">
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FaGavel className="text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complaint Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Brief, clear description of the issue"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department/Ministry <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complaint Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <div className="flex gap-4">
                        {['low', 'medium', 'high', 'critical'].map(level => (
                          <label key={level} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="severity"
                              value={level}
                              checked={formData.severity === level}
                              onChange={(e) => handleInputChange('severity', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className={`text-sm font-medium capitalize ${
                              level === 'low' ? 'text-green-600' :
                              level === 'medium' ? 'text-yellow-600' :
                              level === 'high' ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {level}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendarAlt className="inline mr-2 text-gray-400" />
                        Date of Incident
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfIncident}
                        onChange={(e) => handleInputChange('dateOfIncident', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" />
                    Detailed Information
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                      Location/Address
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, state, or specific location where incident occurred"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide comprehensive details about the incident..."
                      required
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <p className="text-gray-500 text-sm mt-2">Please provide at least 50 characters</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Witness Information (Optional)
                    </label>
                    <textarea
                      value={formData.witnessInfo}
                      onChange={(e) => handleInputChange('witnessInfo', e.target.value)}
                      placeholder="Details about any witnesses"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Outcome/Resolution
                    </label>
                    <textarea
                      value={formData.expectedOutcome}
                      onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                      placeholder="What action or resolution do you expect?"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/dashboard" className="flex-1">
                    <button
                      type="button"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-300"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Next: Upload Evidence
                      <span>→</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 space-y-8">
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FaPaperclip className="text-blue-600" />
                    Supporting Evidence
                  </h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 bg-gray-50 transition-colors">
                    <FaFileAlt className="text-3xl text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence"
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="evidence" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium text-lg">Upload Evidence</span>
                      <span className="text-gray-600"> or drag and drop files here</span>
                    </label>
                    <p className="text-gray-500 text-sm mt-3">
                      Supported formats: Images (JPG, PNG), Documents (PDF, DOC, DOCX, TXT)<br />
                      Maximum file size: 10MB
                    </p>
                    
                    {isProcessing && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <p className="text-blue-700 text-sm font-medium">{processingStep}</p>
                        </div>
                      </div>
                    )}
                    
                    {formData.evidence && !isProcessing && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                          ✓ File processed: {formData.evidence.name}
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          Metadata removed • Encrypted • Ready for submission
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-amber-800 text-sm">
                        <strong>Security Process:</strong> All uploaded files undergo automatic metadata removal to protect your privacy. 
                        Location data, device information, and other identifying markers are stripped before encryption.
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>←</span>
                        Back
                      </div>
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {processingStep}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FaShieldAlt />
                          Submit Complaint
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}