'use client';

import { FaTrophy, FaMedal, FaAward, FaCheckCircle, FaClock, FaChartLine, FaTrain, FaCar, FaBolt, FaHospital, FaGraduationCap, FaCity, FaSeedling, FaHardHat, FaMoneyBillWave, FaLeaf } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

export default function LeaderboardTable() {
    const departments = [
        {
            rank: 1,
            name: 'Ministry of Railways',
            icon: <FaTrain className="text-3xl" />,
            color: 'text-orange-500',
            casesResolved: 2847,
            totalCases: 3012,
            avgResolutionTime: '12 days',
            resolutionRate: 94.5,
            trend: 'up',
            trendValue: '+5.2%',
            score: 98.5
        },
        {
            rank: 2,
            name: 'Ministry of Road Transport',
            icon: <FaCar className="text-3xl" />,
            color: 'text-blue-500',
            casesResolved: 1965,
            totalCases: 2145,
            avgResolutionTime: '15 days',
            resolutionRate: 91.6,
            trend: 'up',
            trendValue: '+3.8%',
            score: 96.2
        },
        {
            rank: 3,
            name: 'Ministry of Power',
            icon: <FaBolt className="text-3xl" />,
            color: 'text-yellow-500',
            casesResolved: 1823,
            totalCases: 2034,
            avgResolutionTime: '14 days',
            resolutionRate: 89.6,
            trend: 'up',
            trendValue: '+2.1%',
            score: 94.8
        },
        {
            rank: 4,
            name: 'Ministry of Health',
            icon: <FaHospital className="text-3xl" />,
            color: 'text-red-500',
            casesResolved: 1654,
            totalCases: 1891,
            avgResolutionTime: '18 days',
            resolutionRate: 87.5,
            trend: 'down',
            trendValue: '-1.3%',
            score: 92.1
        },
        {
            rank: 5,
            name: 'Ministry of Education',
            icon: <FaGraduationCap className="text-3xl" />,
            color: 'text-purple-500',
            casesResolved: 1432,
            totalCases: 1687,
            avgResolutionTime: '16 days',
            resolutionRate: 84.9,
            trend: 'up',
            trendValue: '+4.5%',
            score: 90.3
        },
        {
            rank: 6,
            name: 'Ministry of Urban Development',
            icon: <FaCity className="text-3xl" />,
            color: 'text-indigo-500',
            casesResolved: 1289,
            totalCases: 1567,
            avgResolutionTime: '20 days',
            resolutionRate: 82.3,
            trend: 'up',
            trendValue: '+1.7%',
            score: 88.7
        },
        {
            rank: 7,
            name: 'Ministry of Agriculture',
            icon: <FaSeedling className="text-3xl" />,
            color: 'text-green-500',
            casesResolved: 1156,
            totalCases: 1423,
            avgResolutionTime: '22 days',
            resolutionRate: 81.2,
            trend: 'down',
            trendValue: '-2.1%',
            score: 86.5
        },
        {
            rank: 8,
            name: 'Ministry of Labour',
            icon: <FaHardHat className="text-3xl" />,
            color: 'text-orange-600',
            casesResolved: 1087,
            totalCases: 1398,
            avgResolutionTime: '25 days',
            resolutionRate: 77.8,
            trend: 'up',
            trendValue: '+0.9%',
            score: 84.2
        },
        {
            rank: 9,
            name: 'Ministry of Finance',
            icon: <FaMoneyBillWave className="text-3xl" />,
            color: 'text-emerald-500',
            casesResolved: 945,
            totalCases: 1234,
            avgResolutionTime: '28 days',
            resolutionRate: 76.6,
            trend: 'down',
            trendValue: '-3.2%',
            score: 82.1
        },
        {
            rank: 10,
            name: 'Ministry of Environment',
            icon: <FaLeaf className="text-3xl" />,
            color: 'text-teal-500',
            casesResolved: 823,
            totalCases: 1112,
            avgResolutionTime: '24 days',
            resolutionRate: 74.0,
            trend: 'up',
            trendValue: '+2.3%',
            score: 80.5
        }
    ]; const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return <FaTrophy className="text-3xl text-yellow-400" />;
            case 2:
                return <FaMedal className="text-3xl text-gray-300" />;
            case 3:
                return <FaMedal className="text-3xl text-orange-400" />;
            default:
                return <FaAward className="text-2xl text-cyan-400" />;
        }
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
        if (rank === 2) return 'from-gray-300/20 to-gray-400/20 border-gray-300/50';
        if (rank === 3) return 'from-orange-500/20 to-red-500/20 border-orange-500/50';
        return 'from-white/5 to-white/0 border-white/10';
    };

    const getScoreColor = (score) => {
        if (score >= 95) return 'text-green-400';
        if (score >= 85) return 'text-cyan-400';
        if (score >= 75) return 'text-yellow-400';
        return 'text-orange-400';
    };

    return (
        <div className="space-y-4">
            {/* Table Header - Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-gray-400 text-sm font-semibold">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Department</div>
                <div className="col-span-2">Cases Resolved</div>
                <div className="col-span-2">Resolution Rate</div>
                <div className="col-span-2">Avg Time</div>
                <div className="col-span-1">Trend</div>
                <div className="col-span-1">Score</div>
            </div>

            {/* Leaderboard Items */}
            {departments.map((dept) => (
                <div
                    key={dept.rank}
                    className={`bg-gradient-to-r ${getRankColor(
                        dept.rank
                    )} backdrop-blur-sm rounded-2xl p-6 border transition-all hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02]`}
                >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                        {/* Rank */}
                        <div className="col-span-1 flex items-center justify-center">
                            {getRankBadge(dept.rank)}
                        </div>

                        {/* Department */}
                        <div className="col-span-3 flex items-center gap-3">
                            <div className={`p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 ${dept.color}`}>
                                {dept.icon}
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg">{dept.name}</div>
                                <div className="text-gray-400 text-sm">Rank #{dept.rank}</div>
                            </div>
                        </div>                        {/* Cases Resolved */}
                        <div className="col-span-2">
                            <div className="text-white font-bold text-xl">
                                {dept.casesResolved.toLocaleString()}
                            </div>
                            <div className="text-gray-400 text-sm">
                                of {dept.totalCases.toLocaleString()} total
                            </div>
                        </div>

                        {/* Resolution Rate */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all"
                                        style={{ width: `${dept.resolutionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-cyan-400 font-semibold text-sm mt-1">
                                {dept.resolutionRate}%
                            </div>
                        </div>

                        {/* Avg Time */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 text-white">
                                <FaClock className="text-purple-400" />
                                <span className="font-semibold">{dept.avgResolutionTime}</span>
                            </div>
                        </div>

                        {/* Trend */}
                        <div className="col-span-1">
                            <div className={`flex items-center gap-1 ${dept.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {dept.trend === 'up' ? <MdTrendingUp className="text-xl" /> : <MdTrendingDown className="text-xl" />}
                                <span className="text-sm font-semibold">{dept.trendValue}</span>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="col-span-1">
                            <div className={`text-2xl font-bold ${getScoreColor(dept.score)}`}>
                                {dept.score}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 ${dept.color}`}>
                                    {dept.icon}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{dept.name}</div>
                                    <div className="text-gray-400 text-sm">Rank #{dept.rank}</div>
                                </div>
                            </div>
                            {getRankBadge(dept.rank)}
                        </div>                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-gray-400 text-xs mb-1">Cases Resolved</div>
                                <div className="text-white font-bold">{dept.casesResolved.toLocaleString()}</div>
                                <div className="text-gray-400 text-xs">of {dept.totalCases.toLocaleString()}</div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-gray-400 text-xs mb-1">Resolution Rate</div>
                                <div className="text-cyan-400 font-bold">{dept.resolutionRate}%</div>
                                <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                                        style={{ width: `${dept.resolutionRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-gray-400 text-xs mb-1">Avg Time</div>
                                <div className="text-white font-bold">{dept.avgResolutionTime}</div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-gray-400 text-xs mb-1">Score</div>
                                <div className={`font-bold text-lg ${getScoreColor(dept.score)}`}>{dept.score}</div>
                                <div className={`flex items-center gap-1 text-xs ${dept.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {dept.trend === 'up' ? <MdTrendingUp /> : <MdTrendingDown />}
                                    <span>{dept.trendValue}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
