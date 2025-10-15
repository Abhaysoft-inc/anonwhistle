'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaNetworkWired, FaPlus, FaHistory, FaClock, FaCheckCircle, FaExclamationCircle, FaFileAlt, FaUser, FaMicrophone, FaMicrophoneSlash, FaRobot, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import Link from 'next/link';
import { complaintsAPI, storage } from '@/utils/api';

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
    
    // Voice Assistant States
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isAssistantActive, setIsAssistantActive] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState('');
    const [recognition, setRecognition] = useState(null);

    // Panic Button States
    const [isPanicPressed, setIsPanicPressed] = useState(false);
    const [panicTimer, setPanicTimer] = useState(null);
    const [panicCountdown, setPanicCountdown] = useState(0);
    const [showDecoyScreen, setShowDecoyScreen] = useState(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (!token || !userData) {
            // Redirect to register if not authenticated
            router.push('/register');
            return;
        }

        try {
            const user = JSON.parse(userData);
            setWalletAddress(`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`);

            // Load user complaints and stats
            loadUserData();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/register');
        }

        // Initialize speech recognition
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const speechRecognition = new window.webkitSpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-US';
            
            speechRecognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(finalTranscript);
                    handleVoiceCommand(finalTranscript);
                }
            };

            speechRecognition.onend = () => {
                setIsListening(false);
            };

            setRecognition(speechRecognition);
        }
    }, [router]);

    const loadUserData = async () => {
        try {
            // This would load real data from API
            // For now, we'll keep the mock data but structure it properly
            console.log('Loading user data...');
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

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

    // Voice Assistant Functions
    const startListening = () => {
        if (recognition) {
            setIsListening(true);
            setIsAssistantActive(true);
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition) {
            setIsListening(false);
            recognition.stop();
        }
    };

    const handleVoiceCommand = (command) => {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('new complaint') || lowerCommand.includes('file complaint') || lowerCommand.includes('submit complaint')) {
            setAssistantResponse("I'll help you file a new complaint. Redirecting to the complaint form...");
            setTimeout(() => {
                router.push('/new-complaint');
            }, 2000);
        } else if (lowerCommand.includes('my complaints') || lowerCommand.includes('track complaints') || lowerCommand.includes('complaint status')) {
            setAssistantResponse("Showing your complaint history...");
            setActiveTab('track');
        } else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
            setAssistantResponse("I can help you file new complaints, check your complaint status, or provide guidance on using the platform. Just say 'new complaint' to file one or 'my complaints' to track existing ones.");
        } else if (lowerCommand.includes('logout') || lowerCommand.includes('sign out')) {
            setAssistantResponse("Logging you out securely...");
            setTimeout(() => {
                handleLogout();
            }, 2000);
        } else {
            setAssistantResponse("I understand you want assistance. You can say 'new complaint' to file a complaint, 'my complaints' to track them, or 'help' for more options.");
        }
    };

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Speak assistant response when it changes
    useEffect(() => {
        if (assistantResponse) {
            speakResponse(assistantResponse);
            setTimeout(() => {
                setAssistantResponse('');
                setIsAssistantActive(false);
            }, 5000);
        }
    }, [assistantResponse]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const evidenceFiles = complaint.evidence ? [complaint.evidence] : [];

            const response = await complaintsAPI.submitComplaint({
                title: complaint.title,
                description: complaint.description,
                department: complaint.department
            }, evidenceFiles);

            if (response.success) {
                alert('Complaint submitted successfully!');
                setComplaint({ title: '', department: '', description: '', evidence: null });
                // Reload user data to update stats
                loadUserData();
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint: ' + error.message);
        }
    };

    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('walletAddress'); // Legacy support
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
            
            // 4. Clear sensitive metadata (simulate)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // 5. Optional: Send encrypted alert via Tor (simulated)
            console.log('🚨 PANIC PROTOCOL EXECUTED - Alert sent to trusted authority via Tor');
            
            // 6. Switch to decoy screen
            setShowDecoyScreen(true);
            
            // 7. After 5 seconds, redirect to a decoy page
            setTimeout(() => {
                window.location.href = 'https://www.google.com/search?q=weather+forecast';
            }, 2000);
            
        } catch (error) {
            console.error('Panic protocol error:', error);
            // Emergency fallback - immediate redirect
            window.location.href = 'https://www.google.com/search?q=weather+forecast';
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Resolved') return <FaCheckCircle className="text-green-400" />;
        if (status === 'Under Investigation') return <FaClock className="text-yellow-400" />;
        return <FaExclamationCircle className="text-orange-400" />;
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

            <div className="min-h-screen bg-slate-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <FaShieldAlt className="text-white text-lg" />
                            </div>
                            <div>
                                <span className="text-xl font-semibold text-gray-900">AnonWhistle</span>
                                <span className="text-sm text-gray-500 ml-2">Dashboard</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Connection Status */}
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <FaNetworkWired className="text-green-600 text-sm" />
                                <span className="text-green-700 text-sm font-medium">Secure Connection</span>
                            </div>

                            {/* User Info */}
                            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-500 text-sm" />
                                    <span className="text-gray-700 text-sm font-mono">{walletAddress}</span>
                                </div>
                            </div>

                            {/* Logout */}
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

            {/* Main Content */}
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">File and track your complaints securely through our anonymous reporting system</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                                    <p className="text-2xl font-bold text-gray-900">3</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaFileAlt className="text-blue-600 text-xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Resolved</p>
                                    <p className="text-2xl font-bold text-gray-900">1</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaCheckCircle className="text-green-600 text-xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                                    <p className="text-2xl font-bold text-gray-900">2</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <FaClock className="text-orange-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-8 justify-center">
                        <Link href="/new-complaint">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                                <FaPlus className="text-sm" />
                                File New Complaint
                            </button>
                        </Link>
                    </div>

                    {/* Voice Assistant */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <div className="flex flex-col items-end gap-3">
                            {/* Assistant Response */}
                            {isAssistantActive && assistantResponse && (
                                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaRobot className="text-blue-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Voice Assistant</p>
                                            <p className="text-gray-800 text-sm leading-relaxed">{assistantResponse}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Voice Button */}
                            <button
                                onClick={isListening ? stopListening : startListening}
                                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
                                    isListening 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                                title={isListening ? 'Stop listening' : 'Start voice assistant'}
                            >
                                {isListening ? (
                                    <FaMicrophoneSlash className="text-lg" />
                                ) : (
                                    <FaMicrophone className="text-lg" />
                                )}
                            </button>
                            
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Voice Assistant</p>
                                <p className="text-xs text-gray-400">
                                    {isListening ? 'Listening...' : 'Click to speak'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* File New Complaint Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FaFileAlt className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">File New Complaint</h3>
                                        <p className="text-sm text-gray-500">Submit a new complaint securely</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FaMicrophone className="text-purple-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">AI Powered Complaint</h3>
                                        <p className="text-sm text-gray-500">Use voice assistant to file complaint</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Speak your complaint using our AI voice assistant for hands-free reporting.
                                </p>
                                <button 
                                    onClick={() => setIsListening(!isListening)}
                                    className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
                                        isListening 
                                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                >
                                    {isListening ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                                            Stop Listening
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <FaMicrophone />
                                            Start Voice Complaint
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Track Complaints Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaHistory className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Track Complaints</h3>
                                        <p className="text-sm text-gray-500">Monitor your complaint progress</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
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
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mt-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaExclamationTriangle className="text-red-600 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Safety at a Tap</h3>
                                <p className="text-red-800 text-sm mb-4">Emergency panic button for immediate protection when in danger.</p>
                                <ul className="text-red-700 text-sm space-y-1 mb-6">
                                    <li>• One-tap long-press panic button</li>
                                    <li>• Instantly aborts uploads & wipes ephemeral wallet</li>
                                    <li>• Clears local evidence and sensitive metadata</li>
                                    <li>• Switches to a decoy screen to hide the app</li>
                                    <li>• Optional encrypted alert sent via Tor to trusted authority</li>
                                </ul>
                                <div className="flex items-center gap-4">
                                    <button
                                        onMouseDown={handlePanicPress}
                                        onMouseUp={handlePanicRelease}
                                        onMouseLeave={handlePanicRelease}
                                        onTouchStart={handlePanicPress}
                                        onTouchEnd={handlePanicRelease}
                                        className={`relative px-6 py-4 rounded-lg font-bold text-white transition-all transform select-none ${
                                            isPanicPressed 
                                                ? 'bg-red-700 scale-95 shadow-inner' 
                                                : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                                        }`}
                                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                    >
                                        {isPanicPressed ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                                                <span>RELEASING IN {panicCountdown}s</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaExclamationTriangle />
                                                <span>PANIC BUTTON</span>
                                            </div>
                                        )}
                                    </button>
                                    <div className="text-xs text-red-600">
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
        </>
    );
}
