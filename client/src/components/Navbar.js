'use client';

import Link from 'next/link';
import { FaShieldAlt } from 'react-icons/fa';

export default function Navbar() {
    return (
        <nav className="fixed w-full bg-gray-950 z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <FaShieldAlt className="text-3xl text-cyan-400" />
                        <span className="text-2xl font-bold text-white">AnonWhistle</span>
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-cyan-400 transition">Features</a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition">How It Works</a>
                        <a href="#security" className="text-gray-300 hover:text-cyan-400 transition">Security</a>
                        <Link href="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition">Leaderboard</Link>
                        <Link href="/official-login" className="text-gray-300 hover:text-cyan-400 transition">Officials</Link>
                        <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition">Contact</a>
                    </div>
                    <Link href="/register" className="ml-4">
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full font-semibold shadow transition-all">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
<a href="#contact" className="text-gray-300 hover:text-cyan-400 transition">Contact</a>

