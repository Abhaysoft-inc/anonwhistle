'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUserSecret } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';

export default function HeroSection() {
    const [displayText1, setDisplayText1] = useState('');
    const [displayText2, setDisplayText2] = useState('');
    const [showCursor1, setShowCursor1] = useState(true);
    const [showCursor2, setShowCursor2] = useState(false);

    const text1 = 'Expose Corruption';
    const text2 = 'Remain Anonymous';
    const typingSpeed = 100;
    const pauseAfterFirst = 500;

    useEffect(() => {
        let timeout;

        // Type first line
        if (displayText1.length < text1.length) {
            timeout = setTimeout(() => {
                setDisplayText1(text1.slice(0, displayText1.length + 1));
            }, typingSpeed);
        }
        // Pause and start second line
        else if (displayText2.length === 0 && displayText1.length === text1.length) {
            timeout = setTimeout(() => {
                setShowCursor1(false);
                setShowCursor2(true);
                setDisplayText2(text2.slice(0, 1));
            }, pauseAfterFirst);
        }
        // Type second line
        else if (displayText2.length < text2.length) {
            timeout = setTimeout(() => {
                setDisplayText2(text2.slice(0, displayText2.length + 1));
            }, typingSpeed);
        }
        // Hide cursor when done
        else if (displayText2.length === text2.length) {
            timeout = setTimeout(() => {
                setShowCursor2(false);
            }, 1000);
        }

        return () => clearTimeout(timeout);
    }, [displayText1, displayText2]);

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
                    <div className="relative min-h-[60px] md:min-h-[84px]">
                        {displayText1}
                        {showCursor1 && <span className="animate-pulse text-white">|</span>}
                    </div>
                    <span className="text-cyan-400 relative block min-h-[60px] md:min-h-[84px]">
                        {displayText2}
                        {showCursor2 && <span className="animate-pulse text-cyan-400">|</span>}
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    A blockchain-powered, Tor-secured, AI-enhanced whistleblowing platform
                    for transparent e-governance and corruption-free society.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/register">
                        <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25">
                            <div className="flex items-center gap-2 justify-center relative z-10">
                                <HiOutlineDocumentReport className="text-xl group-hover:animate-pulse" />
                                Submit Report
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </Link>
                    <button className="group relative overflow-hidden border-2 border-cyan-400/70 text-cyan-400 px-6 py-3 rounded-xl font-semibold text-base hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/5">
                        <span className="relative z-10">Learn More</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
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
