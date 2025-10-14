'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaNetworkWired, FaPlus, FaHistory, FaClock, FaCheckCircle, FaExclamationCircle, FaFileAlt, FaUser } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import Link from 'next/link';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('raise');
    const [walletAddress, setWalletAddress] = useState('');
    const router = useRouter();
    const [complaint, setComplaint] = useState({
        title: '',
        department: '',
        description: '',
        evidence: null
    });

    useEffect(() => {
        // Get wallet address from localStorage
        const address = localStorage.getItem('walletAddress');
        if (!address) {
            // Redirect to register if not logged in
            router.push('/register');
        } else {
            // Format address for display
            setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        }
    }, [router]);

    // Mock past complaints
    const pastComplaints = [
        {
            id: 'CMP-001',
            title: 'Bribery in License Department',
            department: 'Road Transport',
            status: 'Under Investigation',
            date: '2025-10-10',
            statusColor: 'yellow'
        },
        {
            id: 'CMP-002',
            title: 'Corruption in Public Works',
            department: 'Urban Development',
            status: 'Resolved',
            date: '2025-09-25',
            statusColor: 'green'
        },
        {
            id: 'CMP-003',
            title: 'Illegal Tax Collection',
            department: 'Finance',
            status: 'Pending Review',
            date: '2025-10-01',
            statusColor: 'orange'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New complaint:', complaint);
        alert('Complaint submitted successfully!');
        setComplaint({ title: '', department: '', description: '', evidence: null });
    };

    const handleLogout = () => {
        localStorage.removeItem('walletAddress');
        router.push('/');
    };

    const getStatusIcon = (status) => {
        if (status === 'Resolved') return <FaCheckCircle className="text-green-400" />;
        if (status === 'Under Investigation') return <FaClock className="text-yellow-400" />;
        return <FaExclamationCircle className="text-orange-400" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Navigation */}
            <nav className="fixed w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <FaShieldAlt className="text-3xl text-blue-400" />
                            <span className="text-2xl font-bold text-white">AnonWhistle</span>
                            <span className="text-sm text-gray-400 ml-2">| User Dashboard</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Tor Status */}
                            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-lg">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <FaNetworkWired className="text-green-400 text-sm" />
                                <span className="text-green-400 text-sm font-medium">Tor Active</span>
                            </div>

                            {/* Wallet Address */}
                            <div className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-400 text-sm" />
                                    <span className="text-gray-300 text-sm font-mono">{walletAddress}</span>
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 transition"
                            >
                                <BiLogOut className="text-lg" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Submit complaints securely and track your cases anonymously</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-400 text-sm font-medium">Total Complaints</p>
                                    <p className="text-white text-3xl font-bold">3</p>
                                </div>
                                <div className="bg-blue-500/20 p-3 rounded-xl">
                                    <FaFileAlt className="text-blue-400 text-2xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-400 text-sm font-medium">Resolved</p>
                                    <p className="text-white text-3xl font-bold">1</p>
                                </div>
                                <div className="bg-green-500/20 p-3 rounded-xl">
                                    <FaCheckCircle className="text-green-400 text-2xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-400 text-sm font-medium">Pending</p>
                                    <p className="text-white text-3xl font-bold">2</p>
                                </div>
                                <div className="bg-orange-500/20 p-3 rounded-xl">
                                    <FaClock className="text-orange-400 text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-gray-800/50 p-2 rounded-2xl w-fit mx-auto">
                        <button
                            onClick={() => setActiveTab('raise')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'raise'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaPlus className="text-sm" />
                            New Complaint
                        </button>
                        <button
                            onClick={() => setActiveTab('track')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'track'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaHistory className="text-sm" />
                            My Complaints
                        </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === 'raise' ? (
                        // Raise New Complaint Form
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-500/20 p-3 rounded-xl">
                                    <FaPlus className="text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Submit New Complaint</h2>
                                    <p className="text-gray-400">All information is encrypted and anonymous</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Complaint Title
                                    </label>
                                    <input
                                        type="text"
                                        value={complaint.title}
                                        onChange={(e) => setComplaint({ ...complaint, title: e.target.value })}
                                        placeholder="Brief description of the issue"
                                        required
                                        className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Department
                                    </label>
                                    <select
                                        value={complaint.department}
                                        onChange={(e) => setComplaint({ ...complaint, department: e.target.value })}
                                        required
                                        className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Select department</option>
                                        <option value="railways">Ministry of Railways</option>
                                        <option value="transport">Road Transport</option>
                                        <option value="power">Power & Energy</option>
                                        <option value="health">Health & Family Welfare</option>
                                        <option value="education">Education</option>
                                        <option value="urban">Urban Development</option>
                                        <option value="agriculture">Agriculture</option>
                                        <option value="labour">Labour & Employment</option>
                                        <option value="finance">Finance</option>
                                        <option value="environment">Environment</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Detailed Description
                                    </label>
                                    <textarea
                                        value={complaint.description}
                                        onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                                        placeholder="Provide detailed information about the complaint..."
                                        required
                                        rows={6}
                                        className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition resize-none"
                                    />
                                </div>

                                {/* Evidence Upload */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Evidence (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-400/50 bg-gray-900/30 transition">
                                        <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                                        <input
                                            type="file"
                                            onChange={(e) => setComplaint({ ...complaint, evidence: e.target.files[0] })}
                                            className="hidden"
                                            id="evidence"
                                            accept="image/*,application/pdf,.doc,.docx"
                                        />
                                        <label htmlFor="evidence" className="cursor-pointer">
                                            <span className="text-blue-400 hover:underline font-medium">Click to upload</span>
                                            <span className="text-gray-400"> or drag and drop</span>
                                        </label>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Images, PDFs, or documents (Max 10MB)
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-xl shadow-blue-500/25"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FaShieldAlt />
                                        Submit Anonymous Complaint
                                    </div>
                                </button>

                                {/* Info */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                                            <FaShieldAlt className="text-blue-400 text-lg" />
                                        </div>
                                        <div>
                                            <div className="text-blue-400 font-semibold mb-2">
                                                🔒 Maximum Privacy Protection
                                            </div>
                                            <div className="text-gray-400 text-sm leading-relaxed">
                                                • End-to-end encryption ensures data security<br />
                                                • Tor network masks your IP and location<br />
                                                • Blockchain authentication prevents tampering<br />
                                                • No personal data stored or tracked
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // Track Past Complaints
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-blue-500/20 p-3 rounded-xl">
                                        <FaHistory className="text-blue-400 text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Your Complaints</h2>
                                        <p className="text-gray-400">Track the status of your submissions</p>
                                    </div>
                                </div>

                                {pastComplaints.length > 0 ? (
                                    <div className="space-y-4">
                                        {pastComplaints.map((c) => (
                                            <div
                                                key={c.id}
                                                className="bg-gray-900/50 border border-gray-600 rounded-2xl p-6 hover:border-blue-400/50 hover:bg-gray-800/50 transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className="bg-gray-700 text-blue-400 font-mono font-semibold px-3 py-1 rounded-lg text-sm">
                                                                {c.id}
                                                            </span>
                                                            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${c.statusColor === 'green' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                                                                    c.statusColor === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                                                                        'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                                                                }`}>
                                                                {getStatusIcon(c.status)}
                                                                {c.status}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-white font-bold text-lg mb-3">
                                                            {c.title}
                                                        </h3>
                                                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                                <span>{c.department}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FaClock className="text-gray-500" />
                                                                <span>{c.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl font-medium transition-all">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FaHistory className="text-6xl text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">No complaints submitted yet</p>
                                        <button
                                            onClick={() => setActiveTab('raise')}
                                            className="mt-4 text-cyan-400 hover:underline font-semibold"
                                        >
                                            Submit your first complaint
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
