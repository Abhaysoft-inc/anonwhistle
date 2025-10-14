'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaUsers, FaClipboardList, FaChartLine, FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimes, FaClock, FaExclamationTriangle, FaFileAlt, FaBell } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { MdAdminPanelSettings, MdGavel, MdVerifiedUser } from 'react-icons/md';

export default function OfficialDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Get user data from localStorage
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');
        if (!role || !email) {
            router.push('/official-login');
        } else {
            setUserRole(role);
            setUserEmail(email);
        }
    }, [router]);

    // Mock complaints data
    const complaints = [
        {
            id: 'CMP-001',
            title: 'Bribery in License Department',
            department: 'Road Transport',
            status: 'Under Investigation',
            priority: 'High',
            submittedBy: '0xABC...123',
            date: '2025-10-10',
            investigator: 'Officer Kumar',
            description: 'Corruption allegations in driving license issuance process...'
        },
        {
            id: 'CMP-002',
            title: 'Illegal Construction Approval',
            department: 'Urban Development',
            status: 'Pending Review',
            priority: 'Medium',
            submittedBy: '0xDEF...456',
            date: '2025-10-08',
            investigator: 'Unassigned',
            description: 'Building permits issued without proper verification...'
        },
        {
            id: 'CMP-003',
            title: 'Tax Evasion in Municipal Office',
            department: 'Finance',
            status: 'Resolved',
            priority: 'High',
            submittedBy: '0xGHI...789',
            date: '2025-09-25',
            investigator: 'Officer Singh',
            description: 'Irregularities found in tax collection process...'
        },
        {
            id: 'CMP-004',
            title: 'Medical Equipment Procurement Fraud',
            department: 'Health & Family Welfare',
            status: 'Under Investigation',
            priority: 'Critical',
            submittedBy: '0xJKL...012',
            date: '2025-10-12',
            investigator: 'Officer Sharma',
            description: 'Overpricing and quality issues in medical equipment purchase...'
        }
    ];

    const stats = {
        totalComplaints: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending Review').length,
        investigating: complaints.filter(c => c.status === 'Under Investigation').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        critical: complaints.filter(c => c.priority === 'Critical').length
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <FaCheckCircle className="text-green-400" />;
            case 'Under Investigation': return <FaSearch className="text-yellow-400" />;
            case 'Pending Review': return <FaClock className="text-orange-400" />;
            default: return <FaExclamationTriangle className="text-red-400" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'High': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
            case 'Medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
            default: return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <MdAdminPanelSettings className="text-red-400" />;
            case 'investigator': return <MdGavel className="text-blue-400" />;
            case 'auditor': return <MdVerifiedUser className="text-green-400" />;
            default: return <FaUsers className="text-purple-400" />;
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'admin': return 'System Administrator';
            case 'investigator': return 'Investigating Officer';
            case 'department_head': return 'Department Head';
            case 'auditor': return 'Compliance Auditor';
            default: return 'Official';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
            {/* Navigation */}
            <nav className="fixed w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <FaShieldAlt className="text-3xl text-blue-400" />
                            <span className="text-2xl font-bold text-white">AnonWhistle</span>
                            <span className="text-sm text-gray-400 ml-2">| Officials Portal</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-white transition">
                                <FaBell className="text-xl" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* User Info */}
                            <div className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getRoleIcon(userRole)}
                                    <div>
                                        <div className="text-white text-sm font-medium">{getRoleName(userRole)}</div>
                                        <div className="text-gray-400 text-xs">{userEmail}</div>
                                    </div>
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
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                        <p className="text-gray-400">Manage complaints and investigations securely</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-400 text-sm font-medium">Total Cases</p>
                                    <p className="text-white text-3xl font-bold">{stats.totalComplaints}</p>
                                </div>
                                <FaClipboardList className="text-blue-400 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-400 text-sm font-medium">Pending</p>
                                    <p className="text-white text-3xl font-bold">{stats.pending}</p>
                                </div>
                                <FaClock className="text-orange-400 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-400 text-sm font-medium">Investigating</p>
                                    <p className="text-white text-3xl font-bold">{stats.investigating}</p>
                                </div>
                                <FaSearch className="text-yellow-400 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-400 text-sm font-medium">Resolved</p>
                                    <p className="text-white text-3xl font-bold">{stats.resolved}</p>
                                </div>
                                <FaCheckCircle className="text-green-400 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-400 text-sm font-medium">Critical</p>
                                    <p className="text-white text-3xl font-bold">{stats.critical}</p>
                                </div>
                                <FaExclamationTriangle className="text-red-400 text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-gray-800/50 p-2 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaChartLine className="text-sm" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'complaints'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaClipboardList className="text-sm" />
                            All Complaints
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'overview' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Complaints */}
                            <div className="bg-gray-800/50 border border-gray-600 rounded-3xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Recent Complaints</h3>
                                <div className="space-y-4">
                                    {complaints.slice(0, 3).map(complaint => (
                                        <div key={complaint.id} className="bg-gray-900/50 border border-gray-600 rounded-xl p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="bg-gray-700 text-blue-400 font-mono text-sm px-2 py-1 rounded">
                                                    {complaint.id}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                                                    {complaint.priority}
                                                </span>
                                            </div>
                                            <h4 className="text-white font-medium mb-1">{complaint.title}</h4>
                                            <p className="text-gray-400 text-sm">{complaint.department} • {complaint.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-800/50 border border-gray-600 rounded-3xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                                <div className="space-y-4">
                                    <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 p-4 rounded-xl text-left transition">
                                        <div className="flex items-center gap-3">
                                            <FaSearch className="text-xl" />
                                            <div>
                                                <div className="font-medium">Review Pending Cases</div>
                                                <div className="text-sm opacity-75">{stats.pending} cases need review</div>
                                            </div>
                                        </div>
                                    </button>
                                    <button className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 p-4 rounded-xl text-left transition">
                                        <div className="flex items-center gap-3">
                                            <FaClipboardList className="text-xl" />
                                            <div>
                                                <div className="font-medium">Assign Investigators</div>
                                                <div className="text-sm opacity-75">Manage case assignments</div>
                                            </div>
                                        </div>
                                    </button>
                                    <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 p-4 rounded-xl text-left transition">
                                        <div className="flex items-center gap-3">
                                            <FaChartLine className="text-xl" />
                                            <div>
                                                <div className="font-medium">Generate Reports</div>
                                                <div className="text-sm opacity-75">Department performance analytics</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* All Complaints View */
                        <div className="bg-gray-800/50 border border-gray-600 rounded-3xl p-8">
                            {/* Search and Filter */}
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="flex-1">
                                    <div className="relative">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search complaints by ID, title, or department..."
                                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Pending Review">Pending Review</option>
                                        <option value="Under Investigation">Under Investigation</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>

                            {/* Complaints Table */}
                            <div className="space-y-4">
                                {filteredComplaints.map(complaint => (
                                    <div key={complaint.id} className="bg-gray-900/50 border border-gray-600 rounded-xl p-6 hover:border-blue-400/50 transition">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="bg-gray-700 text-blue-400 font-mono font-semibold px-3 py-1 rounded-lg">
                                                        {complaint.id}
                                                    </span>
                                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${complaint.status === 'Resolved' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                                                            complaint.status === 'Under Investigation' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                                                                'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                                                        }`}>
                                                        {getStatusIcon(complaint.status)}
                                                        {complaint.status}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(complaint.priority)}`}>
                                                        {complaint.priority} Priority
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-bold text-lg mb-2">
                                                    {complaint.title}
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                                                    <div>
                                                        <span className="font-medium">Department:</span>
                                                        <div className="text-white">{complaint.department}</div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Submitted:</span>
                                                        <div className="text-white">{complaint.date}</div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Investigator:</span>
                                                        <div className="text-white">{complaint.investigator}</div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Reporter:</span>
                                                        <div className="text-white font-mono">{complaint.submittedBy}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl font-medium transition">
                                                    <FaEye className="mr-2" />
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredComplaints.length === 0 && (
                                <div className="text-center py-12">
                                    <FaFileAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">No complaints match your search criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}