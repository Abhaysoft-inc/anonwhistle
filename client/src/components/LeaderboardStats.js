'use client';

import { FaCheckCircle, FaClock, FaTrophy, FaChartLine } from 'react-icons/fa';

export default function LeaderboardStats() {
    const stats = [
        {
            icon: <FaCheckCircle className="text-4xl text-green-400" />,
            label: 'Total Cases Resolved',
            value: '14,021',
            change: '+12.5%',
            trend: 'up'
        },
        {
            icon: <FaClock className="text-4xl text-purple-400" />,
            label: 'Average Resolution Time',
            value: '18.9 days',
            change: '-2.3 days',
            trend: 'down'
        },
        {
            icon: <FaTrophy className="text-4xl text-yellow-400" />,
            label: 'Top Performer',
            value: 'Ministry of Railways',
            change: '94.5% rate',
            trend: 'up'
        },
        {
            icon: <FaChartLine className="text-4xl text-cyan-400" />,
            label: 'Overall Efficiency',
            value: '83.2%',
            change: '+4.1%',
            trend: 'up'
        }
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>{stat.icon}</div>
                        <div className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-cyan-400'}`}>
                            {stat.change}
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
