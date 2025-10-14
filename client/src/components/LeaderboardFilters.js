'use client';

import { FaFilter, FaCalendar, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

export default function LeaderboardFilters() {
    const [timeRange, setTimeRange] = useState('all');
    const [category, setCategory] = useState('all');

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <FaFilter className="text-cyan-400" />
                    <span className="font-semibold">Filter Leaderboard</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Time Range */}
                    <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition"
                        >
                            <option value="all">All Time</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition"
                    >
                        <option value="all">All Categories</option>
                        <option value="corruption">Corruption Cases</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="service">Service Delivery</option>
                        <option value="financial">Financial Irregularities</option>
                    </select>

                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
