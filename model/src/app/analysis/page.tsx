'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AI Analysis Types
interface AnalysisResult {
  spamProbability: number;
  verdict: 'Genuine' | 'Spam' | 'Uncertain';
  reasoning: string;
  confidence: number;
  analysisTime: number;
  keywords: string[];
  thinkingSteps: ThinkingStep[];
}

interface ThinkingStep {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed';
  findings?: string;
  duration?: number;
}

interface AnalysisHistory {
  id: string;
  content: string;
  result: AnalysisResult;
  timestamp: Date;
}

export default function AIAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [currentThinkingStep, setCurrentThinkingStep] = useState<number>(-1);

  // Initialize thinking steps
  const initializeThinkingSteps = (): ThinkingStep[] => [
    {
      id: 1,
      title: "📝 Text Preprocessing",
      description: "Normalizing text, removing formatting, tokenizing content",
      progress: 0,
      status: 'pending'
    },
    {
      id: 2,
      title: "🔍 Keyword Analysis",
      description: "Scanning for spam indicators and genuine complaint markers",
      progress: 0,
      status: 'pending'
    },
    {
      id: 3,
      title: "📊 Structure Analysis", 
      description: "Analyzing text structure, grammar, and coherence patterns",
      progress: 0,
      status: 'pending'
    },
    {
      id: 4,
      title: "🧠 Semantic Understanding",
      description: "Evaluating context, emotional tone, and narrative flow",
      progress: 0,
      status: 'pending'
    },
    {
      id: 5,
      title: "⚖️ Risk Assessment",
      description: "Calculating spam probability and confidence scores",
      progress: 0,
      status: 'pending'
    },
    {
      id: 6,
      title: "✅ Final Verdict",
      description: "Generating verdict and detailed reasoning",
      progress: 0,
      status: 'pending'
    }
  ];

  // Smart AI Analysis Logic with Thinking Simulation
  const analyzeText = async (text: string): Promise<AnalysisResult> => {
    const startTime = Date.now();
    const steps = initializeThinkingSteps();
    setThinkingSteps(steps);
    
    // Spam keywords detection
    const spamKeywords = [
      'win money', 'lottery', 'urgent', 'congratulations', 'click here',
      'free money', 'limited time', 'act now', 'guaranteed', 'risk free',
      'make money fast', 'earn from home', 'no experience needed'
    ];
    
    const genuineKeywords = [
      'complaint', 'harassment', 'discrimination', 'workplace', 'unsafe',
      'violation', 'policy', 'manager', 'employee', 'incident', 'report'
    ];

    // Step 1: Text Preprocessing
    setCurrentThinkingStep(0);
    await simulateThinkingStep(0, async () => {
      return `Processing ${text.length} characters, ${text.trim().split(/\s+/).length} words detected`;
    });

    // Step 2: Keyword Analysis
    setCurrentThinkingStep(1);
    const foundSpamKeywords = spamKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    const foundGenuineKeywords = genuineKeywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    await simulateThinkingStep(1, async () => {
      return `Found ${foundSpamKeywords.length} spam indicators, ${foundGenuineKeywords.length} genuine markers`;
    });

    // Step 3: Structure Analysis
    setCurrentThinkingStep(2);
    const wordCount = text.trim().split(/\s+/).length;
    const hasProperStructure = text.includes('.') || text.includes('!') || text.includes('?');
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    
    await simulateThinkingStep(2, async () => {
      return `Structure score: ${hasProperStructure ? 'Good' : 'Poor'}, Caps ratio: ${Math.round(capsRatio * 100)}%`;
    });

    // Step 4: Semantic Understanding
    setCurrentThinkingStep(3);
    const hasEmotionalContext = /\b(feel|felt|upset|angry|concerned|worried|frustrated)\b/i.test(text);
    const hasMoney = /\$\d+/.test(text);
    
    await simulateThinkingStep(3, async () => {
      return `Emotional context: ${hasEmotionalContext ? 'Detected' : 'None'}, Financial terms: ${hasMoney ? 'Present' : 'Absent'}`;
    });

    // Step 5: Risk Assessment
    setCurrentThinkingStep(4);
    let spamScore = 0;
    
    // Calculate spam probability
    spamScore += foundSpamKeywords.length * 20;
    spamScore += capsRatio > 0.3 ? 15 : 0;
    spamScore += text.includes('!!!') ? 10 : 0;
    spamScore += wordCount < 10 ? 15 : 0;
    spamScore += hasMoney ? 10 : 0;
    
    // Genuine indicators (reduce spam score)
    spamScore -= foundGenuineKeywords.length * 15;
    spamScore -= hasProperStructure ? 10 : 0;
    spamScore -= hasEmotionalContext ? 15 : 0;
    spamScore -= wordCount > 50 ? 10 : 0;
    
    const spamProbability = Math.max(0, Math.min(100, spamScore));
    
    await simulateThinkingStep(4, async () => {
      return `Risk score: ${spamScore} → Probability: ${spamProbability}%`;
    });

    // Step 6: Final Verdict
    setCurrentThinkingStep(5);
    let verdict: 'Genuine' | 'Spam' | 'Uncertain';
    if (spamProbability < 20) verdict = 'Genuine';
    else if (spamProbability > 70) verdict = 'Spam';
    else verdict = 'Uncertain';
    
    // Generate reasoning
    const reasons = [];
    if (foundSpamKeywords.length > 0) {
      reasons.push(`Contains spam-related phrases: "${foundSpamKeywords.join('", "')}"`)
    }
    if (foundGenuineKeywords.length > 0) {
      reasons.push(`Contains contextual complaint keywords indicating authenticity`)
    }
    if (hasEmotionalContext) {
      reasons.push('Emotional tone matches genuine complaints')
    }
    if (hasProperStructure) {
      reasons.push('Well-structured narrative detected')
    }
    if (wordCount < 10) {
      reasons.push('Text is too brief for detailed analysis')
    }
    
    const reasoning = reasons.length > 0 
      ? reasons.join('. ') + '.'
      : 'Standard text analysis patterns applied.';

    const confidence = verdict === 'Uncertain' ? 60 + Math.random() * 20 : 80 + Math.random() * 20;
    
    await simulateThinkingStep(5, async () => {
      return `Final verdict: ${verdict} (${Math.round(confidence)}% confidence)`;
    });

    const analysisTime = Date.now() - startTime;

    return {
      spamProbability,
      verdict,
      reasoning,
      confidence,
      analysisTime,
      keywords: [...foundSpamKeywords, ...foundGenuineKeywords],
      thinkingSteps: steps
    };
  };

  // Simulate individual thinking step with realistic timing
  const simulateThinkingStep = async (stepIndex: number, analysis: () => Promise<string>) => {
    const step = thinkingSteps[stepIndex];
    if (!step) return;

    // Mark step as processing
    setThinkingSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'processing' as const } : s
    ));

    // Simulate processing time with progress
    const duration = 800 + Math.random() * 1200; // 0.8-2s per step
    const progressSteps = 20;
    const stepDelay = duration / progressSteps;

    for (let i = 0; i <= progressSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      setThinkingSteps(prev => prev.map((s, idx) => 
        idx === stepIndex ? { ...s, progress: (i / progressSteps) * 100 } : s
      ));
    }

    // Get analysis findings
    const findings = await analysis();

    // Mark step as completed
    setThinkingSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { ...s, status: 'completed' as const, progress: 100, findings, duration: Math.round(duration) }
        : s
    ));
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setCurrentResult(null);
    setCurrentThinkingStep(-1);
    
    const result = await analyzeText(inputText);
    setCurrentResult(result);
    
    // Add to history
    const historyItem: AnalysisHistory = {
      id: Date.now().toString(),
      content: inputText,
      result,
      timestamp: new Date()
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 4)]); // Keep last 5
    setIsAnalyzing(false);
    setCurrentThinkingStep(-1);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Genuine': return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'Spam': return isDarkMode ? 'text-red-400' : 'text-red-600';
      case 'Uncertain': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case 'Genuine': return isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
      case 'Spam': return isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200';
      case 'Uncertain': return isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      default: return isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Genuine': return '✅';
      case 'Spam': return '❌';
      case 'Uncertain': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Evidence Analysis Dashboard</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Analyzing with AI • Real-time spam detection
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4 space-y-2`}>
              <h3 className="font-semibold text-sm uppercase tracking-wide mb-4">Navigation</h3>
              
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab('analyze')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'analyze'
                    ? isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>🧠</span>
                <span>AI Analysis</span>
              </motion.button>
              
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'history'
                    ? isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>📊</span>
                <span>History</span>
                {history.length > 0 && (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {history.length}
                  </span>
                )}
              </motion.button>
              
              <div className={`border-t pt-4 mt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-xs space-y-3">
                  <div>
                    <div className="font-medium mb-2">Analysis Statistics</div>
                    <div className="space-y-1">
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>🟢 Genuine</span>
                        <span className="font-medium">{history.filter(h => h.result.verdict === 'Genuine').length}</span>
                      </div>
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>🔴 Spam</span>
                        <span className="font-medium">{history.filter(h => h.result.verdict === 'Spam').length}</span>
                      </div>
                      <div className={`flex justify-between ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>🟡 Uncertain</span>
                        <span className="font-medium">{history.filter(h => h.result.verdict === 'Uncertain').length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {history.length > 0 && (
                    <div>
                      <div className="font-medium mb-2">Accuracy Rate</div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {Math.round((history.filter(h => h.result.verdict !== 'Uncertain').length / history.length) * 100)}% Decisive
                      </div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Avg: {Math.round(history.reduce((acc, h) => acc + h.result.confidence, 0) / history.length)}% Confidence
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'analyze' && (
                <motion.div
                  key="analyze"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Input Section */}
                  <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                    <h2 className="text-xl font-semibold mb-4">Evidence Analysis Input</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Complaint Text or Evidence Content
                        </label>
                        
                        {/* File Upload Simulation */}
                        <div className="mb-4">
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                            isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                          } transition-colors cursor-pointer`}>
                            <input
                              type="file"
                              accept=".pdf,.docx,.txt"
                              className="hidden"
                              id="file-upload"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setInputText(`[File Uploaded: ${file.name}]\n\nSimulated extracted content from ${file.type} file:\n\nThis is a sample complaint about workplace discrimination. The employee reports being treated unfairly due to their background and requests an investigation into the matter. Multiple incidents have been documented with specific dates and witness information provided.`);
                                }
                              }}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <div className={`text-4xl mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>📎</div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Click to upload PDF, DOCX, or TXT file
                              </div>
                              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                (Simulated file processing for demo)
                              </div>
                            </label>
                          </div>
                        </div>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Paste complaint text here or describe the evidence content..."
                          rows={8}
                          className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        
                        {/* Sample Text Examples */}
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="mb-2">Try these examples:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <button
                              onClick={() => setInputText("I want to file a complaint against my manager for workplace harassment. The incident occurred last week when I was working late, and my supervisor made inappropriate comments about my appearance. I felt very uncomfortable and this has been affecting my work performance. I have witnesses who can verify this incident.")}
                              className={`text-left p-2 rounded text-xs border ${isDarkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                              📄 Genuine Complaint Example
                            </button>
                            <button
                              onClick={() => setInputText("CONGRATULATIONS! You have won $1,000,000 in our lottery! Click here NOW to claim your prize! This is URGENT and LIMITED TIME offer! No experience needed! Guaranteed money! Act now before it's too late!")}
                              className={`text-left p-2 rounded text-xs border ${isDarkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                              🚨 Spam Text Example
                            </button>
                          </div>
                        </div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {inputText.length}/5000 characters
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                        disabled={!inputText.trim() || isAnalyzing}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                          !inputText.trim() || isAnalyzing
                            ? isDarkMode 
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        }`}
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center justify-center space-x-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Running AI Spam Detection...</span>
                          </div>
                        ) : (
                          '🧠 Analyze Evidence'
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* AI Thinking Process */}
                  <AnimatePresence>
                    {isAnalyzing && thinkingSteps.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`rounded-lg border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold">🧠 AI Thinking Process</h3>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className={`w-4 h-4 border-2 rounded-full ${
                                isDarkMode ? 'border-blue-400 border-t-transparent' : 'border-blue-600 border-t-transparent'
                              }`}
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Analyzing...
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {thinkingSteps.map((step, index) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                                step.status === 'completed' 
                                  ? isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
                                  : step.status === 'processing'
                                    ? isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                                    : isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              {/* Step Icon */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step.status === 'completed'
                                  ? 'bg-green-500 text-white'
                                  : step.status === 'processing'
                                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                    : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'
                              }`}>
                                {step.status === 'completed' ? '✓' : step.id}
                              </div>

                              {/* Step Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-medium ${
                                    step.status === 'processing' 
                                      ? isDarkMode ? 'text-blue-300' : 'text-blue-700'
                                      : ''
                                  }`}>
                                    {step.title}
                                  </h4>
                                  {step.duration && (
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {step.duration}ms
                                    </span>
                                  )}
                                </div>
                                
                                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {step.description}
                                </p>

                                {/* Progress Bar */}
                                {(step.status === 'processing' || step.status === 'completed') && (
                                  <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${
                                    isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                                  }`}>
                                    <motion.div
                                      className={`h-full ${
                                        step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                      }`}
                                      initial={{ width: '0%' }}
                                      animate={{ width: `${step.progress}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                )}

                                {/* Findings */}
                                {step.findings && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`text-xs p-2 rounded ${
                                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'
                                    } border-l-4 ${
                                      step.status === 'completed' ? 'border-green-500' : 'border-blue-500'
                                    }`}
                                  >
                                    💡 {step.findings}
                                  </motion.div>
                                )}
                              </div>

                              {/* Current Step Indicator */}
                              {currentThinkingStep === index && step.status === 'processing' && (
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                  className={`w-3 h-3 rounded-full ${
                                    isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                                  }`}
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* Overall Progress */}
                        <div className="mt-6 pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Overall Progress
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {thinkingSteps.filter(s => s.status === 'completed').length} / {thinkingSteps.length} steps
                            </span>
                          </div>
                          <div className={`w-full h-3 rounded-full overflow-hidden ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: '0%' }}
                              animate={{ 
                                width: `${(thinkingSteps.filter(s => s.status === 'completed').length / thinkingSteps.length) * 100}%` 
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results Section */}
                  <AnimatePresence>
                    {currentResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`rounded-lg border p-6 ${getVerdictBg(currentResult.verdict)}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">🧠 AI Analysis Result</h3>
                          <span className="text-sm text-gray-500">
                            Analyzed in {currentResult.analysisTime}ms
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Main Verdict */}
                          <div className="text-center py-6">
                            <div className={`text-4xl font-bold ${getVerdictColor(currentResult.verdict)} mb-2`}>
                              {getVerdictIcon(currentResult.verdict)} {currentResult.verdict}
                            </div>
                            <div className="text-lg font-medium mb-2">
                              Spam Probability: {currentResult.spamProbability}%
                            </div>
                            
                            {/* Confidence Meter */}
                            <div className="max-w-xs mx-auto">
                              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                AI Confidence: {Math.round(currentResult.confidence)}%
                              </div>
                              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${currentResult.confidence}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={`h-full ${
                                    currentResult.confidence > 80 
                                      ? 'bg-green-500' 
                                      : currentResult.confidence > 60 
                                        ? 'bg-yellow-500' 
                                        : 'bg-red-500'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Reasoning */}
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                            <h4 className="font-medium mb-2">💬 AI Reasoning:</h4>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {currentResult.reasoning}
                            </p>
                            
                            {currentResult.keywords.length > 0 && (
                              <div className="mt-3">
                                <span className="text-sm font-medium">Detected Keywords: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {currentResult.keywords.map((keyword, idx) => (
                                    <span
                                      key={idx}
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Explain Analysis Button */}
                          <div className="text-center mt-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowExplanationModal(true)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDarkMode 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              🔍 Explain Analysis
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Explanation Modal */}
                  <AnimatePresence>
                    {showExplanationModal && currentResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowExplanationModal(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className={`max-w-2xl w-full rounded-lg p-6 max-h-96 overflow-y-auto ${
                            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">🔍 Detailed AI Analysis Explanation</h3>
                            <button
                              onClick={() => setShowExplanationModal(false)}
                              className={`p-2 rounded-lg ${
                                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            <div>
                              <h4 className="font-medium mb-2">🧠 AI Model Analysis Process:</h4>
                              <ul className={`space-y-1 pl-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>• <strong>Keyword Analysis:</strong> Scanned for spam indicators (lottery, win money, urgent) vs genuine complaint terms (harassment, discrimination, workplace)</li>
                                <li>• <strong>Structure Analysis:</strong> Evaluated text coherence, proper punctuation, and narrative flow</li>
                                <li>• <strong>Emotional Context:</strong> Detected emotional language patterns typical of authentic complaints</li>
                                <li>• <strong>Length & Detail:</strong> Assessed content depth and descriptive detail level</li>
                                <li>• <strong>Language Patterns:</strong> Analyzed capitalization, formatting, and linguistic markers</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">📊 Scoring Breakdown:</h4>
                              <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <div>Base Score: 0% (neutral start)</div>
                                <div>Spam Keywords Found: +{currentResult.keywords.filter(k => ['win money', 'lottery', 'urgent', 'congratulations', 'click here', 'free money', 'limited time', 'act now', 'guaranteed', 'risk free', 'make money fast', 'earn from home', 'no experience needed'].includes(k.toLowerCase())).length * 20}%</div>
                                <div>Genuine Keywords Found: -{currentResult.keywords.filter(k => ['complaint', 'harassment', 'discrimination', 'workplace', 'unsafe', 'violation', 'policy', 'manager', 'employee', 'incident', 'report'].includes(k.toLowerCase())).length * 15}%</div>
                                <div>Final Spam Probability: {currentResult.spamProbability}%</div>
                              </div>
                            </div>
                            
                            {currentResult.thinkingSteps && currentResult.thinkingSteps.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">🧠 AI Thinking Process:</h4>
                                <div className="space-y-2">
                                  {currentResult.thinkingSteps.map((step) => (
                                    <div key={step.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">{step.title}</span>
                                        {step.duration && (
                                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {step.duration}ms
                                          </span>
                                        )}
                                      </div>
                                      {step.findings && (
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          💡 {step.findings}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-medium mb-2">🎯 Confidence Factors:</h4>
                              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                The AI confidence of {Math.round(currentResult.confidence)}% is based on the clarity of detected patterns, 
                                consistency of language markers, and the strength of identifying characteristics in the analyzed text.
                              </p>
                            </div>

                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <strong>Note:</strong> This is a demonstration system using simulated AI analysis. 
                                In production, this would use advanced machine learning models trained on large datasets 
                                of legitimate complaints and spam content.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
                  
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <div className={`text-4xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>📊</div>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No analysis history yet. Start by analyzing some evidence!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border ${getVerdictBg(item.result.verdict)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`font-medium ${getVerdictColor(item.result.verdict)}`}>
                              {getVerdictIcon(item.result.verdict)} {item.result.verdict} ({item.result.spamProbability}%)
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {item.timestamp.toLocaleString()}
                            </div>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                            {item.content.length > 100 
                              ? `${item.content.substring(0, 100)}...` 
                              : item.content
                            }
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}