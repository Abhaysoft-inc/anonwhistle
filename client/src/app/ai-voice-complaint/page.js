'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaUser, FaFileAlt, FaMapMarkerAlt, FaCalendarAlt, FaRobot, FaBrain, FaSpinner } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIVoiceComplaint() {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [fullTranscript, setFullTranscript] = useState('');
    const [complaintData, setComplaintData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        date: '',
        reporterName: '',
        priority: 'medium',
        summary: '',
        recommendations: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('ready'); // ready, listening, analyzing, reviewing, submitting
    
    const recognitionRef = useRef(null);
    const genAI = useRef(null);

    // Initialize Gemini AI
    useEffect(() => {
        // Initialize Gemini - In production, use environment variables
        const API_KEY = "AIzaSyBLz1FuJP8q3Mv1QJ-8xeaKdJGp8H7mPZo"; // Replace with your API key
        genAI.current = new GoogleGenerativeAI(API_KEY);
    }, []);

    // Initialize speech recognition and Gemini AI
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize speech recognition
            if ('webkitSpeechRecognition' in window) {
                recognitionRef.current = new window.webkitSpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    setTranscript(interimTranscript);
                    
                    if (finalTranscript) {
                        setFullTranscript(prev => prev + finalTranscript);
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setFullTranscript('');
            setCurrentPhase('listening');
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            
            if (fullTranscript.trim().length > 10) {
                setTimeout(() => analyzeComplaintWithGemini(), 1000);
            }
        }
    };

    const analyzeComplaintWithGemini = async () => {
        setIsAnalyzing(true);
        setCurrentPhase('analyzing');

        try {
            const model = genAI.current.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are an expert complaint analysis AI. Analyze the following complaint transcript and extract structured information. 
            
            User's Complaint Transcript: "${fullTranscript}"
            
            Please analyze this complaint and provide a structured response in the following JSON format:
            {
                "title": "Brief, professional title for the complaint (max 100 characters)",
                "category": "Choose from: corruption, misconduct, fraud, harassment, discrimination, safety_violation, environmental, financial, other",
                "description": "Detailed, well-structured description of the complaint with proper paragraphs",
                "location": "Location where incident occurred (extract from transcript or mark as 'Not specified')",
                "date": "Date/time when incident occurred (extract from transcript, use relative terms like 'recent', 'last week', etc. if specific date not given)",
                "reporterName": "Reporter's name if mentioned, otherwise 'Anonymous'",
                "priority": "Assess priority as: low, medium, high, critical based on severity",
                "summary": "Professional executive summary of the key points (2-3 sentences)",
                "recommendations": "Suggested next steps or actions based on the complaint type"
            }
            
            Make sure to:
            - Extract all relevant details from the user's speech
            - Use professional language
            - Categorize appropriately
            - Assess priority based on severity and urgency
            - Provide actionable recommendations
            
            Return ONLY the JSON object, no additional text.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysisText = response.text();

            // Parse the JSON response
            const analysisData = JSON.parse(analysisText);
            
            setComplaintData(analysisData);
            setAnalysisComplete(true);
            setCurrentPhase('reviewing');

        } catch (error) {
            console.error('Error analyzing complaint with Gemini:', error);
            setCurrentPhase('ready');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleVoiceCommand = (command) => {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('submit') || lowerCommand.includes('file') || lowerCommand.includes('confirm')) {
            submitComplaint();
        } else if (lowerCommand.includes('modify') || lowerCommand.includes('change') || lowerCommand.includes('edit')) {
            setAnalysisComplete(false);
            setCurrentPhase('ready');
            setComplaintData({
                title: '', description: '', category: '', location: '',
                date: '', reporterName: '', priority: 'medium', summary: '', recommendations: ''
            });
        }
    };

    const submitComplaint = async () => {
        setCurrentPhase('submitting');
        
        // Simulate API call with complaint data
        setTimeout(() => {
            const complaintId = 'CMP-' + Date.now().toString().slice(-8);
            
            // Store complaint data (in real app, this would go to API)
            localStorage.setItem('lastComplaint', JSON.stringify({
                ...complaintData,
                id: complaintId,
                timestamp: new Date().toISOString(),
                transcript: fullTranscript
            }));
            
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }, 3000);
    };

    const getPhaseDescription = () => {
        switch(currentPhase) {
            case 'ready':
                return 'Ready to listen to your complaint';
            case 'listening':
                return 'Listening to your complaint...';
            case 'analyzing':
                return 'AI is analyzing your complaint...';
            case 'reviewing':
                return 'Review the generated complaint details';
            case 'submitting':
                return 'Submitting your complaint...';
            default:
                return 'AI Voice Complaint System';
        }
    };

    const getPhaseProgress = () => {
        switch(currentPhase) {
            case 'ready': return 0;
            case 'listening': return 25;
            case 'analyzing': return 50;
            case 'reviewing': return 75;
            case 'submitting': return 100;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-[#383f51] text-white">
            {/* Header */}
            <header className="bg-[#2d3142] shadow-lg border-b border-[#AB9F9D]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaBrain className="text-purple-400" />
                            AI Voice Complaint System
                        </h1>
                        <div className="w-32"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/70">{getPhaseDescription()}</span>
                        <span className="text-sm text-white/70">{Math.round(getPhaseProgress())}% Complete</span>
                    </div>
                    <div className="w-full bg-[#4a5568] rounded-full h-3">
                        <div 
                            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${getPhaseProgress()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Voice Interface */}
                    <div className="bg-[#4a5568] rounded-xl p-6 border border-[#AB9F9D]/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaRobot className="text-purple-400" />
                            AI Voice Assistant
                        </h2>

                        {/* Current Phase Status */}
                        <div className="mb-6 p-4 bg-[#383f51] rounded-lg border border-purple-500/30">
                            <div className="flex items-center gap-3 mb-2">
                                {currentPhase === 'ready' && <FaMicrophone className="text-purple-400" />}
                                {currentPhase === 'listening' && <FaMicrophone className="text-purple-400 animate-pulse" />}
                                {currentPhase === 'analyzing' && <FaBrain className="text-blue-400 animate-spin" />}
                                {currentPhase === 'reviewing' && <FaFileAlt className="text-green-400" />}
                                {currentPhase === 'submitting' && <FaSpinner className="text-yellow-400 animate-spin" />}
                                <h3 className="text-lg font-semibold capitalize">{currentPhase} Phase</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                {currentPhase === 'ready' && "Click the microphone button to start recording your complaint."}
                                {currentPhase === 'listening' && "Speak your complaint naturally. The system is capturing everything you say."}
                                {currentPhase === 'analyzing' && "AI is processing your speech and creating a structured complaint report."}
                                {currentPhase === 'reviewing' && "Review the AI-generated complaint details and click submit when ready."}
                                {currentPhase === 'submitting' && "Securely submitting your complaint to the system."}
                            </p>
                        </div>

                        {/* Voice Controls */}
                        <div className="flex flex-col items-center gap-6">
                            {/* Main Action Button */}
                            {!analysisComplete ? (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    disabled={isAnalyzing}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                                        isListening 
                                            ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/20 animate-pulse' 
                                            : isAnalyzing
                                            ? 'bg-blue-500 border-blue-400 animate-pulse'
                                            : 'bg-purple-600 border-purple-500 hover:bg-purple-700'
                                    } ${isAnalyzing ? 'opacity-75' : ''}`}
                                >
                                    {isAnalyzing ? (
                                        <FaBrain className="text-white text-3xl animate-spin" />
                                    ) : isListening ? (
                                        <FaMicrophoneSlash className="text-white text-3xl" />
                                    ) : (
                                        <FaMicrophone className="text-white text-3xl" />
                                    )}
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVoiceCommand('submit')}
                                        disabled={currentPhase === 'submitting'}
                                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg"
                                    >
                                        Submit Complaint
                                    </button>
                                    <button
                                        onClick={() => handleVoiceCommand('modify')}
                                        disabled={currentPhase === 'submitting'}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg"
                                    >
                                        Record Again
                                    </button>
                                </div>
                            )}

                            {/* Status Display */}
                            <div className="text-center">
                                {isListening && (
                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Recording your complaint...</span>
                                    </div>
                                )}
                                {isAnalyzing && (
                                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                                        <FaBrain className="animate-spin text-sm" />
                                        <span className="text-sm">AI is analyzing your speech...</span>
                                    </div>
                                )}
                                {currentPhase === 'ready' && (
                                    <span className="text-sm text-white/60">Click microphone to start recording</span>
                                )}
                                {analysisComplete && (
                                    <span className="text-sm text-green-400">Analysis complete! Review and submit below.</span>
                                )}
                            </div>

                            {/* Live Speech-to-Text Display */}
                            {(transcript || fullTranscript) && (
                                <div className="w-full bg-[#383f51] rounded-lg p-4 border border-[#AB9F9D]/30 max-h-48 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaMicrophone className="text-purple-400 text-sm" />
                                        <h4 className="text-sm font-medium text-purple-400">Speech-to-Text</h4>
                                        {isListening && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto"></div>}
                                    </div>
                                    <div className="text-sm text-white/90 leading-relaxed">
                                        <span className="text-white">{fullTranscript}</span>
                                        {transcript && <span className="text-purple-400 bg-purple-400/10 px-1 rounded">{transcript}</span>}
                                    </div>
                                    {fullTranscript && (
                                        <div className="mt-2 pt-2 border-t border-white/10">
                                            <span className="text-xs text-white/50">
                                                {fullTranscript.split(' ').length} words captured
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI-Generated Complaint Preview */}
                    <div className="bg-[#4a5568] rounded-xl p-6 border border-[#AB9F9D]/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaBrain className="text-green-400" />
                            AI-Generated Complaint Report
                        </h2>

                        {!analysisComplete ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <div className="relative mb-6">
                                    <FaBrain className="text-6xl text-purple-400/30" />
                                    {isListening && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                    )}
                                    {isAnalyzing && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-spin"></div>
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-white/70 mb-2">
                                    {currentPhase === 'ready' && 'Ready to Record'}
                                    {currentPhase === 'listening' && 'Listening...'}
                                    {currentPhase === 'analyzing' && 'AI Processing...'}
                                </h3>
                                <p className="text-sm text-white/50 max-w-md">
                                    {currentPhase === 'ready' && 'Click the microphone to start recording your complaint. Speak naturally and the AI will structure it automatically.'}
                                    {currentPhase === 'listening' && 'Speak your complaint clearly. The system is capturing everything you say and will analyze it when you\'re done.'}
                                    {currentPhase === 'analyzing' && 'AI is processing your speech and generating a structured complaint report. Please wait...'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-blue-500">
                                    <label className="block text-sm font-medium text-blue-400 mb-1">Complaint Title</label>
                                    <p className="text-white font-medium">{complaintData.title}</p>
                                </div>

                                {/* Category & Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-yellow-500">
                                        <label className="block text-sm font-medium text-yellow-400 mb-1">Category</label>
                                        <p className="text-white capitalize">{complaintData.category.replace('_', ' ')}</p>
                                    </div>
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-red-500">
                                        <label className="block text-sm font-medium text-red-400 mb-1">Priority</label>
                                        <p className="text-white capitalize">{complaintData.priority}</p>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-green-500">
                                    <label className="block text-sm font-medium text-green-400 mb-1">Executive Summary</label>
                                    <p className="text-white/90 text-sm leading-relaxed">{complaintData.summary}</p>
                                </div>

                                {/* Description */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-purple-500">
                                    <label className="block text-sm font-medium text-purple-400 mb-1">Detailed Description</label>
                                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{complaintData.description}</p>
                                </div>

                                {/* Location & Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-indigo-500">
                                        <label className="block text-sm font-medium text-indigo-400 mb-1">Location</label>
                                        <p className="text-white/90 text-sm">{complaintData.location}</p>
                                    </div>
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-cyan-500">
                                        <label className="block text-sm font-medium text-cyan-400 mb-1">Date</label>
                                        <p className="text-white/90 text-sm">{complaintData.date}</p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-orange-500">
                                    <label className="block text-sm font-medium text-orange-400 mb-1">AI Recommendations</label>
                                    <p className="text-white/90 text-sm leading-relaxed">{complaintData.recommendations}</p>
                                </div>

                                {/* Reporter Info */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-pink-500">
                                    <label className="block text-sm font-medium text-pink-400 mb-1">Reporter</label>
                                    <p className="text-white/90 text-sm">{complaintData.reporterName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}