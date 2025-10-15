'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaNetworkWired, FaPlus, FaHistory, FaClock, FaCheckCircle, FaExclamationCircle, FaFileAlt, FaUser, FaMicrophone, FaMicrophoneSlash, FaExclamationTriangle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import Link from 'next/link';
import FloatingPanicButton from '../../components/FloatingPanicButton';

export default function Dashboard() {
    const [walletAddress, setWalletAddress] = useState('');
    const router = useRouter();
    const [complaint, setComplaint] = useState({
        title: '',
        department: '',
        description: '',
        evidence: null
    });

    // Voice Assistant States
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [recognition, setRecognition] = useState(null);

    // Panic Button States
    const [isPanicPressed, setIsPanicPressed] = useState(false);
    const [panicTimer, setPanicTimer] = useState(null);
    const [panicCountdown, setPanicCountdown] = useState(0);
    const [showDecoyScreen, setShowDecoyScreen] = useState(false);

    useEffect(() => {
        // No authentication - dummy mode
        setWalletAddress('0x1234...abcd');
        loadMockUserData();
    }, []);

    const loadMockUserData = () => {
        // Frontend-only mode - using mock data
        console.log('Loading mock user data...');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Frontend-only mode - simulate submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create mock complaint entry
            const newComplaint = {
                id: 'CMP-' + String(Date.now()).slice(-6),
                title: complaint.title,
                description: complaint.description,
                department: complaint.department,
                status: 'Submitted',
                date: new Date().toISOString().split('T')[0],
                submittedAt: new Date().toLocaleString()
            };

            // Store in localStorage for persistence (optional)
            const existingComplaints = JSON.parse(localStorage.getItem('userComplaints') || '[]');
            existingComplaints.unshift(newComplaint);
            localStorage.setItem('userComplaints', JSON.stringify(existingComplaints));

            alert('Complaint submitted successfully! (Frontend mode)');
            setComplaint({ title: '', department: '', description: '', evidence: null });

            // Reload mock data to update stats
            loadMockUserData();
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint: ' + error.message);
        }
    };

    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('walletAddress');
        router.push('/');
    };

    // Panic Button Functions
    const handlePanicPress = () => {
        setIsPanicPressed(true);
        setPanicCountdown(3);

        const timer = setInterval(() => {
            setPanicCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    executePanicProtocol();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setPanicTimer(timer);
    };

    const handlePanicRelease = () => {
        if (panicTimer) {
            clearInterval(panicTimer);
            setPanicTimer(null);
        }
        setIsPanicPressed(false);
        setPanicCountdown(0);
    };

    const executePanicProtocol = async () => {
        try {
            // 1. Stop any ongoing uploads or processes
            if (recognition) {
                recognition.stop();
            }
            setIsListening(false);

            // 2. Clear ephemeral wallet and local data
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('complaints');
            localStorage.removeItem('userPreferences');

            // 3. Clear form data and evidence
            setComplaint({ title: '', department: '', description: '', evidence: null });
            setTranscript('');
            setAssistantResponse('');

            // 4. Optional: Send encrypted alert via Tor (simulated)
            console.log('🚨 PANIC PROTOCOL EXECUTED');

            // 5. Switch to decoy screen
            setShowDecoyScreen(true);

            // 6. After 2 seconds, redirect to a decoy page
            setTimeout(() => {
                window.location.href = 'https://www.google.com/search?q=weather+forecast';
            }, 2000);

        } catch (error) {
            console.error('Panic protocol error:', error);
            // Emergency fallback - immediate redirect
            window.location.href = 'https://www.google.com/search?q=weather+forecast';
        }
    };

    return (
        <>
            {/* Decoy Screen - Emergency Safety Mode */}
            {showDecoyScreen && (
                <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaNetworkWired className="text-blue-600 text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Weather Network</h1>
                            <p className="text-gray-600">Loading weather information...</p>
                        </div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-[#383f51]">
                {/* Navigation */}
                <nav className="bg-[#2d3142] shadow-lg border-b border-[#AB9F9D]/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <FaShieldAlt className="text-white text-lg" />
                                </div>
                                <div>
                                    <span className="text-xl font-semibold text-white">AnonWhistle</span>
                                    <span className="text-sm text-white/70 ml-2">Dashboard</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Connection Status */}
                                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-md">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <FaNetworkWired className="text-green-400 text-sm" />
                                    <span className="text-green-300 text-sm font-medium">Secure Connection</span>
                                </div>

                                {/* User Info */}
                                <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="text-white/70 text-sm" />
                                        <span className="text-white text-sm font-mono">{walletAddress}</span>
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-white/70 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/20 transition-colors"
                                >
                                    <BiLogOut className="text-lg" />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-white/70">File and track your complaints securely through our anonymous reporting system</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">Total Complaints</p>
                                        <p className="text-2xl font-bold text-white">3</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaFileAlt className="text-blue-400 text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">Resolved</p>
                                        <p className="text-2xl font-bold text-white">1</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <FaCheckCircle className="text-green-400 text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">In Progress</p>
                                        <p className="text-2xl font-bold text-white">2</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <FaClock className="text-orange-400 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* File New Complaint Card */}
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <FaFileAlt className="text-blue-400 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">File New Complaint</h3>
                                            <p className="text-sm text-white/70">Submit a new complaint securely</p>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4">
                                        Report corruption, misconduct, or violations through our secure encrypted form.
                                    </p>
                                    <Link href="/new-complaint">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                            File Complaint
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* AI Powered Complaint Card */}
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <FaMicrophone className="text-purple-400 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">AI Voice Assistant</h3>
                                            <p className="text-sm text-white/70">Use voice to file complaint</p>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4">
                                        Speak your complaint using our AI voice assistant for hands-free reporting.
                                    </p>
                                    <Link href="/ai-voice-complaint">
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                            <div className="flex items-center justify-center gap-2">
                                                <FaMicrophone />
                                                Start Voice Complaint
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Track Complaints Card */}
                            <div className="bg-[#4a5568] rounded-xl shadow-lg border border-[#AB9F9D]/30 hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <FaHistory className="text-green-400 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Track Complaints</h3>
                                            <p className="text-sm text-white/70">Monitor your progress</p>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4">
                                        View status updates and track the progress of all your submitted complaints.
                                    </p>
                                    <Link href="/my-complaints">
                                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                            View My Complaints
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Panic Button Section */}
                        <div className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FaExclamationTriangle className="text-red-400 text-xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-red-300 mb-2">Emergency Safety Protocol</h3>
                                    <p className="text-red-200 text-sm mb-4">Emergency panic button for immediate protection when in danger.</p>
                                    <ul className="text-red-300 text-sm space-y-1 mb-6">
                                        <li>• Hold button for 3 seconds to activate</li>
                                        <li>• Instantly clears local data and evidence</li>
                                        <li>• Switches to decoy screen to hide the app</li>
                                        <li>• Automatically redirects to safe website</li>
                                    </ul>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onMouseDown={handlePanicPress}
                                            onMouseUp={handlePanicRelease}
                                            onMouseLeave={handlePanicRelease}
                                            onTouchStart={handlePanicPress}
                                            onTouchEnd={handlePanicRelease}
                                            className={`relative px-6 py-4 rounded-lg font-bold text-white transition-all transform select-none ${isPanicPressed
                                                    ? 'bg-red-700 scale-95 shadow-inner'
                                                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            🚨 EMERGENCY
                                            {isPanicPressed && panicCountdown > 0 && (
                                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                                    {panicCountdown}
                                                </div>
                                            )}
                                        </button>

                                        <div className="text-xs text-red-300">
                                            <p className="font-medium">HOLD FOR 3 SECONDS TO ACTIVATE</p>
                                            <p>Release to cancel</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Floating Panic Button */}
            <FloatingPanicButton />
        </>
    );
}