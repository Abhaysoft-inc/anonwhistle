'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FaArrowLeft, FaRobot, FaBrain, FaUserSecret, FaFileAlt, FaMicroscope,
    FaExclamationTriangle, FaShieldAlt, FaClock, FaMapMarkerAlt, FaUsers,
    FaEye, FaDownload, FaShare, FaFlag, FaCheckCircle, FaTimes, FaEdit,
    FaChartLine, FaDatabase, FaFingerprint, FaSearchLocation, FaCamera,
    FaVideo, FaFileImage, FaFilePdf, FaSpinner, FaLightbulb, FaBullseye
} from 'react-icons/fa';
import { MdAnalytics, MdSecurity, MdVerifiedUser, MdGavel, MdAssignment } from 'react-icons/md';

function ComplaintDetailContent() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [complaint, setComplaint] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [evidenceAnalysis, setEvidenceAnalysis] = useState(null);
    const [analyzingEvidence, setAnalyzingEvidence] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const complaintId = searchParams.get('id');

    useEffect(() => {
        // Mock enhanced complaint data
        const mockComplaintData = {
            id: 'CMP-001',
            title: 'Bribery in License Department',
            description: 'A detailed report of systematic corruption in the Regional Transport Office (RTO) where officials are demanding bribes for license processing. Multiple citizens have reported similar incidents over the past 6 months. The corruption appears to be organized with set rates for different types of licenses.',
            department: 'Road Transport Office',
            status: 'Under Investigation',
            priority: 'High',
            date: '2024-03-15',
            location: 'Regional Transport Office, Sector 15, Delhi',
            investigator: 'Inspector Raj Kumar',
            submittedBy: '0x7f9c...a4b2',
            estimatedLoss: '₹2,50,000',
            publicSupport: 247,
            witnesses: 8,
            evidence: [
                { type: 'image', name: 'receipt_bribe.jpg', size: '2.3 MB', uploadDate: '2024-03-15' },
                { type: 'video', name: 'conversation_recording.mp4', size: '15.7 MB', uploadDate: '2024-03-15' },
                { type: 'document', name: 'witness_statement.pdf', size: '890 KB', uploadDate: '2024-03-16' },
                { type: 'image', name: 'office_photo.jpg', size: '3.1 MB', uploadDate: '2024-03-16' }
            ],
            timeline: [
                { action: 'Complaint Filed', by: 'Anonymous Reporter', date: '2024-03-15 10:30 AM' },
                { action: 'Case Assigned', by: 'System', date: '2024-03-15 11:00 AM' },
                { action: 'Initial Review Completed', by: 'Inspector Raj Kumar', date: '2024-03-16 02:15 PM' },
                { action: 'Evidence Collection Started', by: 'Investigation Team', date: '2024-03-18 09:00 AM' }
            ],
            relatedOfficials: [
                { name: 'Mr. Suresh Sharma', position: 'Senior Clerk', involvement: 'Primary Suspect', riskLevel: 'High' },
                { name: 'Ms. Priya Singh', position: 'Assistant Manager', involvement: 'Possible Accomplice', riskLevel: 'Medium' },
                { name: 'Mr. Amit Kumar', position: 'Office Supervisor', involvement: 'Under Review', riskLevel: 'Low' }
            ]
        };

        // Mock AI Analysis Data
        const mockAIAnalysis = {
            summary: 'This case presents a clear pattern of systematic corruption within the RTO license department. The evidence suggests organized bribery with standardized rates, indicating institutional corruption rather than isolated incidents.',
            keyPoints: [
                'Systematic corruption pattern detected across multiple transactions',
                'Evidence of organized bribery with standardized rate structure',
                'Multiple witnesses corroborate similar experiences',
                'Financial transactions traced through blockchain evidence',
                'Pattern matches 12 other reported cases in the same department'
            ],
            riskAssessment: {
                corruptionLevel: 85,
                publicImpact: 78,
                evidenceStrength: 92,
                urgency: 88
            },
            recommendations: [
                'Immediate suspension of identified officials pending investigation',
                'Comprehensive audit of all license applications in the past 6 months',
                'Implementation of digital payment systems to prevent cash transactions',
                'Enhanced monitoring and surveillance systems',
                'Whistleblower protection measures for additional witnesses'
            ],
            piiConcerns: [
                'Reporter identity protected through blockchain anonymization',
                'Witness names encrypted and stored securely',
                'Official names flagged for investigation procedures',
                'Location data anonymized in public records'
            ]
        };

        // Simulate loading complaint data
        setTimeout(() => {
            setComplaint(mockComplaintData);
            setAiAnalysis(mockAIAnalysis);
            setLoading(false);
        }, 1500);
    }, [complaintId]);



    const analyzeEvidence = async (evidenceItem) => {
        setAnalyzingEvidence(true);
        // Simulate AI evidence analysis
        setTimeout(() => {
            setEvidenceAnalysis({
                item: evidenceItem,
                results: {
                    authenticity: 94,
                    relevance: 89,
                    quality: 87,
                    findings: [
                        'Metadata analysis confirms original capture time and location',
                        'No signs of digital manipulation detected',
                        'Audio quality sufficient for voice recognition analysis',
                        'Facial recognition matches with department employee records'
                    ]
                }
            });
            setAnalyzingEvidence(false);
        }, 3000);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return <FaFileImage className="text-blue-500" />;
            case 'video': return <FaVideo className="text-red-500" />;
            case 'document': return <FaFilePdf className="text-green-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    const getRiskColor = (level) => {
        switch (level.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#383F51] flex items-center justify-center">
                <div className="text-center text-white">
                    <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
                    <p className="text-lg">Loading complaint details...</p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen bg-[#383F51] flex items-center justify-center">
                <div className="text-center text-white">
                    <FaExclamationTriangle className="text-4xl mx-auto mb-4" />
                    <p className="text-lg">Complaint not found</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 bg-[#DDDBF1] text-[#383F51] px-4 py-2 rounded-lg hover:bg-[#DDDBF1]/80 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#383F51]">
            {/* Header */}
            <div className="bg-[#3C4F76] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-[#DDDBF1]/20 rounded-lg transition text-white"
                            >
                                <FaArrowLeft className="text-xl" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>
                                <p className="text-white/70">Case ID: {complaint.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {complaint.priority} Priority
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${complaint.status === 'Under Investigation' ? 'bg-blue-100 text-blue-800' :
                                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {complaint.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#3C4F76]/50 border-b border-[#DDDBF1]/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: FaEye },
                            { id: 'ai-analysis', label: 'AI Analysis', icon: FaRobot },
                            { id: 'evidence', label: 'Evidence', icon: FaFileAlt },
                            { id: 'officials', label: 'Officials/PII', icon: FaUserSecret },
                            { id: 'timeline', label: 'Timeline', icon: FaClock }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition ${activeTab === tab.id
                                        ? 'border-[#DDDBF1] text-white'
                                        : 'border-transparent text-white/70 hover:text-white'
                                    }`}
                            >
                                <tab.icon />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <FaFileAlt className="mr-3" />
                                    Case Description
                                </h3>
                                <p className="text-white/80 leading-relaxed">{complaint.description}</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#3C4F76] rounded-xl p-4 text-center">
                                    <FaUsers className="text-[#DDDBF1] text-2xl mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{complaint.publicSupport}</div>
                                    <div className="text-white/70 text-sm">Public Support</div>
                                </div>
                                <div className="bg-[#3C4F76] rounded-xl p-4 text-center">
                                    <FaEye className="text-[#DDDBF1] text-2xl mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{complaint.witnesses}</div>
                                    <div className="text-white/70 text-sm">Witnesses</div>
                                </div>
                                <div className="bg-[#3C4F76] rounded-xl p-4 text-center">
                                    <FaFileAlt className="text-[#DDDBF1] text-2xl mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{complaint.evidence.length}</div>
                                    <div className="text-white/70 text-sm">Evidence Files</div>
                                </div>
                                <div className="bg-[#3C4F76] rounded-xl p-4 text-center">
                                    <FaFlag className="text-[#DDDBF1] text-2xl mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{complaint.estimatedLoss}</div>
                                    <div className="text-white/70 text-sm">Est. Loss</div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Case Information */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Department:</span>
                                        <span className="text-white font-medium">{complaint.department}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Investigator:</span>
                                        <span className="text-white font-medium">{complaint.investigator}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Filed Date:</span>
                                        <span className="text-white font-medium">{complaint.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Reporter:</span>
                                        <span className="text-white font-mono text-sm">{complaint.submittedBy}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    Location
                                </h3>
                                <p className="text-white/80">{complaint.location}</p>
                                <button className="mt-3 bg-[#DDDBF1] text-[#383F51] px-4 py-2 rounded-lg text-sm hover:bg-[#DDDBF1]/80 transition">
                                    View on Map
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full bg-[#DDDBF1] text-[#383F51] py-2 px-4 rounded-lg font-medium hover:bg-[#DDDBF1]/80 transition">
                                        Update Status
                                    </button>
                                    <button className="w-full bg-[#AB9F9D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#AB9F9D]/80 transition">
                                        Assign Investigator
                                    </button>
                                    <button className="w-full bg-[#D1BEB0] text-[#383F51] py-2 px-4 rounded-lg font-medium hover:bg-[#D1BEB0]/80 transition">
                                        Add Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai-analysis' && (
                    <div className="space-y-8">
                        {/* AI Summary */}
                        <div className="bg-gradient-to-r from-[#3C4F76] to-[#AB9F9D] rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                <FaRobot className="mr-3 text-[#DDDBF1]" />
                                AI-Generated Summary
                            </h3>
                            <p className="text-white/90 text-lg leading-relaxed">{aiAnalysis.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Key Points */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <FaBullseye className="mr-3 text-[#DDDBF1]" />
                                    Key Points
                                </h4>
                                <ul className="space-y-3">
                                    {aiAnalysis.keyPoints.map((point, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <FaLightbulb className="text-[#DDDBF1] mt-1 flex-shrink-0" />
                                            <span className="text-white/80">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Risk Assessment */}
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <FaChartLine className="mr-3 text-[#DDDBF1]" />
                                    Risk Assessment
                                </h4>
                                <div className="space-y-4">
                                    {Object.entries(aiAnalysis.riskAssessment).map(([key, value]) => (
                                        <div key={key}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="text-white font-bold">{value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-[#DDDBF1] to-[#D1BEB0] h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-[#3C4F76] rounded-xl p-6">
                            <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <MdGavel className="mr-3 text-[#DDDBF1]" />
                                AI Recommendations
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aiAnalysis.recommendations.map((rec, index) => (
                                    <div key={index} className="bg-[#383F51] rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-[#DDDBF1] text-[#383F51] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="text-white/80">{rec}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PII Concerns */}
                        <div className="bg-[#3C4F76] rounded-xl p-6">
                            <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <FaShieldAlt className="mr-3 text-[#DDDBF1]" />
                                Privacy & PII Concerns
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aiAnalysis.piiConcerns.map((concern, index) => (
                                    <div key={index} className="bg-[#383F51] rounded-lg p-4 border-l-4 border-[#DDDBF1]">
                                        <span className="text-white/80">{concern}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'evidence' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white">Evidence Files</h3>
                            <div className="flex space-x-3">
                                <button className="bg-[#DDDBF1] text-[#383F51] px-4 py-2 rounded-lg hover:bg-[#DDDBF1]/80 transition">
                                    <FaDownload className="mr-2" />
                                    Download All
                                </button>
                                <button className="bg-[#3C4F76] text-white px-4 py-2 rounded-lg hover:bg-[#3C4F76]/80 transition">
                                    <FaShare className="mr-2" />
                                    Share Evidence
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {complaint.evidence.map((item, index) => (
                                <div key={index} className="bg-[#3C4F76] rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        {getFileIcon(item.type)}
                                        <button
                                            onClick={() => analyzeEvidence(item)}
                                            className="bg-[#DDDBF1] text-[#383F51] px-3 py-1 rounded-lg text-sm hover:bg-[#DDDBF1]/80 transition flex items-center"
                                        >
                                            <FaMicroscope className="mr-1" />
                                            Analyze
                                        </button>
                                    </div>
                                    <h4 className="text-white font-medium mb-2">{item.name}</h4>
                                    <div className="text-white/70 text-sm space-y-1">
                                        <p>Size: {item.size}</p>
                                        <p>Uploaded: {item.uploadDate}</p>
                                        <p>Type: {item.type.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Evidence Analysis Results */}
                        {analyzingEvidence && (
                            <div className="bg-[#3C4F76] rounded-xl p-6">
                                <div className="flex items-center justify-center space-x-3">
                                    <FaSpinner className="animate-spin text-[#DDDBF1] text-xl" />
                                    <span className="text-white">Analyzing evidence with AI...</span>
                                </div>
                            </div>
                        )}

                        {evidenceAnalysis && (
                            <div className="bg-gradient-to-r from-[#3C4F76] to-[#AB9F9D] rounded-xl p-6">
                                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <MdAnalytics className="mr-3" />
                                    Evidence Analysis: {evidenceAnalysis.item.name}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">{evidenceAnalysis.results.authenticity}%</div>
                                        <div className="text-white/80">Authenticity</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">{evidenceAnalysis.results.relevance}%</div>
                                        <div className="text-white/80">Relevance</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">{evidenceAnalysis.results.quality}%</div>
                                        <div className="text-white/80">Quality</div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="font-semibold text-white mb-3">Analysis Findings:</h5>
                                    <ul className="space-y-2">
                                        {evidenceAnalysis.results.findings.map((finding, index) => (
                                            <li key={index} className="flex items-start space-x-2 text-white/80">
                                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                                <span>{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'officials' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-[#3C4F76] to-[#AB9F9D] rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                <FaUserSecret className="mr-3" />
                                Implicated Officials & PII Information
                            </h3>
                            <p className="text-white/80">All personally identifiable information is protected and encrypted according to privacy regulations.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {complaint.relatedOfficials.map((official, index) => (
                                <div key={index} className="bg-[#3C4F76] rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-xl font-semibold text-white">{official.name}</h4>
                                            <p className="text-[#DDDBF1]">{official.position}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(official.riskLevel)}`}>
                                            {official.riskLevel} Risk
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-[#383F51] rounded-lg p-4">
                                            <h5 className="font-semibold text-white mb-2 flex items-center">
                                                <MdAssignment className="mr-2 text-[#DDDBF1]" />
                                                Involvement
                                            </h5>
                                            <p className="text-white/80">{official.involvement}</p>
                                        </div>

                                        <div className="bg-[#383F51] rounded-lg p-4">
                                            <h5 className="font-semibold text-white mb-2 flex items-center">
                                                <FaFingerprint className="mr-2 text-[#DDDBF1]" />
                                                PII Status
                                            </h5>
                                            <p className="text-green-400">Protected & Encrypted</p>
                                        </div>

                                        <div className="bg-[#383F51] rounded-lg p-4">
                                            <h5 className="font-semibold text-white mb-2 flex items-center">
                                                <MdSecurity className="mr-2 text-[#DDDBF1]" />
                                                Verification
                                            </h5>
                                            <p className="text-blue-400">Identity Verified</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PII Protection Notice */}
                        <div className="bg-[#3C4F76] rounded-xl p-6 border-l-4 border-[#DDDBF1]">
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <FaShieldAlt className="mr-2 text-[#DDDBF1]" />
                                Privacy Protection Notice
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                                <ul className="space-y-2">
                                    <li>• All personal data is encrypted at rest</li>
                                    <li>• Access logs are maintained for audit</li>
                                    <li>• Data sharing requires proper authorization</li>
                                </ul>
                                <ul className="space-y-2">
                                    <li>• Anonymous reporting protects whistleblowers</li>
                                    <li>• Blockchain ensures data integrity</li>
                                    <li>• GDPR compliant data handling</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white flex items-center">
                            <FaClock className="mr-3 text-[#DDDBF1]" />
                            Case Timeline
                        </h3>

                        <div className="relative">
                            {complaint.timeline.map((item, index) => (
                                <div key={index} className="flex items-start space-x-4 pb-6">
                                    <div className="flex-shrink-0 w-4 h-4 bg-[#DDDBF1] rounded-full mt-2 relative">
                                        {index < complaint.timeline.length - 1 && (
                                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-[#DDDBF1]/50"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-[#3C4F76] rounded-xl p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-white">{item.action}</h4>
                                            <span className="text-[#DDDBF1] text-sm">{item.date}</span>
                                        </div>
                                        <p className="text-white/70">by {item.by}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center">
                <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading complaint details...</p>
            </div>
        </div>
    );
}

export default function ComplaintDetailPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ComplaintDetailContent />
        </Suspense>
    );
}