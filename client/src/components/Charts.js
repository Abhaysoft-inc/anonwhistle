'use client';

import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ChartCard = ({ title, data, type = 'bar' }) => {
    const maxValue = Math.max(...data.map(item => item.value));

    if (type === 'doughnut') {
        return (
            <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 42 42">
                            <circle
                                cx="21"
                                cy="21"
                                r="15.915"
                                fill="transparent"
                                stroke="#AB9F9D"
                                strokeWidth="3"
                            />
                            {data.map((item, index) => {
                                const offset = data.slice(0, index).reduce((acc, d) => acc + d.value, 0);
                                const percentage = (item.value / data.reduce((acc, d) => acc + d.value, 0)) * 100;
                                return (
                                    <circle
                                        key={index}
                                        cx="21"
                                        cy="21"
                                        r="15.915"
                                        fill="transparent"
                                        stroke={item.color}
                                        strokeWidth="3"
                                        strokeDasharray={`${percentage} ${100 - percentage}`}
                                        strokeDashoffset={-offset / data.reduce((acc, d) => acc + d.value, 0) * 100}
                                        className="transition-all duration-500"
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {data.reduce((acc, item) => acc + item.value, 0)}
                                </div>
                                <div className="text-sm text-white/70">Total</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-white">{item.label}</span>
                            </div>
                            <span className="text-sm font-medium text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                            <span className="text-sm font-medium text-white min-w-0 flex-1">{item.label}</span>
                            <div className="flex-1 bg-[#383F51] rounded-full h-2 max-w-24">
                                <div
                                    className="bg-[#DDDBF1] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-bold text-white min-w-fit">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart = ({ title, data, trend, labels }) => {
    const maxValue = Math.max(...data);
    const monthLabels = labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    
    return (
        <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <div className={`flex items-center space-x-1 text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            <div className="h-32 flex items-end space-x-2 mb-2">
                {data.map((value, index) => {
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                                {/* Tooltip on hover */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                                    {value} complaints
                                </div>
                                <div
                                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 w-full hover:from-blue-500 hover:to-blue-300"
                                    style={{ height: `${Math.max(height, 2)}px`, minHeight: '2px' }}
                                ></div>
                            </div>
                            <span className="text-xs text-white/70 mt-2 font-medium">
                                {monthLabels[index] || (index + 1)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/10 pt-2">
                <span>Total: {data.reduce((sum, val) => sum + val, 0)} complaints</span>
                <span>Avg: {Math.round(data.reduce((sum, val) => sum + val, 0) / data.length)}</span>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, change, icon: Icon, color = 'beige' }) => {
    const isPositive = change > 0;
    const colorClasses = {
        beige: 'bg-[#DDDBF1] text-[#383F51]',
        green: 'bg-green-300 text-green-800',
        yellow: 'bg-amber-300 text-amber-800',
        red: 'bg-red-300 text-red-800',
        purple: 'bg-purple-300 text-purple-800'
    };

    return (
        <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                    <div className={`flex items-center mt-2 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                        <span>{Math.abs(change)}%</span>
                        <span className="text-white/70 ml-1">vs last month</span>
                    </div>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <Icon className="text-xl" />
                </div>
            </div>
        </div>
    );
};

export { ChartCard, LineChart, MetricCard };