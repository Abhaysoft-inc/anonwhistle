'use client';

import { FaTrophy, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import LeaderboardStats from '@/components/LeaderboardStats';
import LeaderboardFilters from '@/components/LeaderboardFilters';
import LeaderboardTable from '@/components/LeaderboardTable';
import Footer from '@/components/Footer';

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navigation */}
            <nav className="fixed w-full bg-gray-950 z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
                            <FaShieldAlt className="text-3xl text-cyan-400" />
                            <span className="text-2xl font-bold text-white">AnonWhistle</span>
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition">
                                <FaArrowLeft />
                                <span>Back to Home</span>
                            </Link>
                            <Link href="/register">
                                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full font-semibold shadow transition-all">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-30 rounded-full"></div>
                                <FaTrophy className="text-8xl text-yellow-400 relative" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Department Leaderboard
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Track and compare the performance of Indian government departments in resolving
                            corruption complaints and ensuring accountability.
                        </p>
                    </div>

                    {/* Stats */}
                    <LeaderboardStats />

                    {/* Filters */}
                    <LeaderboardFilters />

                    {/* Leaderboard Table */}
                    <LeaderboardTable />

                    {/* Additional Info */}
                    <div className="mt-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                How Rankings Are Calculated
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6 text-left">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-cyan-400 font-bold mb-2">Resolution Rate (40%)</div>
                                    <div className="text-gray-400 text-sm">
                                        Percentage of cases successfully resolved compared to total cases received.
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-cyan-400 font-bold mb-2">Response Time (30%)</div>
                                    <div className="text-gray-400 text-sm">
                                        Average time taken to resolve cases, with faster resolutions scoring higher.
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-cyan-400 font-bold mb-2">Trend & Volume (30%)</div>
                                    <div className="text-gray-400 text-sm">
                                        Improvement trends over time and total volume of cases handled effectively.
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-gray-400 text-sm">
                                Rankings are updated in real-time based on blockchain-verified case resolutions.
                                All data is transparent and immutable.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
