'use client';

import { useState } from 'react';
import { FaShieldAlt, FaArrowLeft, FaUserSecret } from 'react-icons/fa';
import Link from 'next/link';
import WalletSelector from '@/components/WalletSelector';
import SecurityFeatures from '@/components/SecurityFeatures';
import RegistrationForm from '@/components/RegistrationForm';

export default function Register() {
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const handleWalletConnect = (address, wallet) => {
        setWalletAddress(address);
        setSelectedWallet(wallet);
        setIsConnected(true);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setWalletAddress('');
        setSelectedWallet(null);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navigation */}
            <nav className="fixed w-full bg-black/30 backdrop-blur-md z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
                            <FaShieldAlt className="text-3xl text-cyan-400" />
                            <span className="text-2xl font-bold text-white">AnonWhistle</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition">
                            <FaArrowLeft />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="relative">

                            </div>
                        </div>
                        <p className="text-2xl md:text-2xl font-bold text-white mb-4">
                            Anonymous Registration
                        </p>

                    </div>

                    {!isConnected ? (
                        // Wallet Selection
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                                    Choose Your Wallet
                                </h2>

                                <WalletSelector onWalletConnect={handleWalletConnect} />
                                <SecurityFeatures />
                            </div>
                        </div>
                    ) : (
                        // Registration Form
                        <RegistrationForm
                            walletAddress={walletAddress}
                            selectedWallet={selectedWallet}
                            onDisconnect={handleDisconnect}
                        />
                    )}

                    {/* Additional Info */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400">
                            Don&apos;t have a crypto wallet?{' '}
                            <a href="#" className="text-cyan-400 hover:underline">
                                Learn how to get started
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black/40 border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>&copy; 2025 AnonWhistle. Fighting corruption with technology. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
