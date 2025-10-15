'use client';

import Link from 'next/link';
import { FaUserSecret } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';

export default function HeroSection() {
    const stats = [
        { number: '100%', label: 'Anonymous' },
        { number: '24/7', label: 'Available' },
        { number: '1000+', label: 'Cases Solved' },
        { number: '256-bit', label: 'Encryption' }
    ];

    return (
        <section className="min-h-screen w-full relative bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            {/* Ocean Abyss Background with Top Glow */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000',
                }}
            />
            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <FaUserSecret className="text-8xl text-cyan-400 relative" />
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Expose Corruption <br />
                    <span className="text-cyan-400">
                        Remain Anonymous
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    A blockchain-powered, Tor-secured, AI-enhanced whistleblowing platform
                    for transparent e-governance and corruption-free society.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition">
                            <div className="flex items-center gap-2 justify-center">
                                <HiOutlineDocumentReport className="text-2xl" />
                                Submit Anonymous Report
                            </div>
                        </button>
                    </Link>
                    <button className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-400 hover:text-slate-900 transition-all transform hover:scale-105">
                        Learn More
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                            <div className="text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
