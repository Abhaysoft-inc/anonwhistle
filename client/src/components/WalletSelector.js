'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaWallet, FaEthereum, FaExclamationTriangle } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiWallet3Fill } from 'react-icons/ri';

export default function WalletSelector({ onWalletConnect }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [error, setError] = useState(null);

    const wallets = [
        {
            id: 'metamask',
            name: 'MetaMask',
            icon: <Image src="/MetaMask_Fox.svg.png" alt="MetaMask" width={80} height={80} className="rounded-lg" />,
            color: 'text-orange-400',
            description: 'Connect with MetaMask wallet',
            isAvailable: typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask
        }
    ];

    const handleWalletConnect = async (walletId) => {
        setSelectedWallet(walletId);
        setIsConnecting(true);
        setError(null);

        try {
            if (walletId === 'metamask') {
                await connectMetaMask();
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            setError(error.message);
            setIsConnecting(false);
            setSelectedWallet(null);
        }
    };

    const connectMetaMask = async () => {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed. Please install MetaMask extension first.');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
            }

            const address = accounts[0];

            // Get network info
            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            });

            const wallet = wallets.find(w => w.id === 'metamask');

            // Call the parent callback
            onWalletConnect(address, wallet, { chainId });
            setIsConnecting(false);

        } catch (error) {
            console.error('MetaMask connection error:', error);

            // Handle specific MetaMask errors
            if (error.code === 4001) {
                throw new Error('Connection rejected. Please approve the connection request in MetaMask.');
            } else if (error.code === -32002) {
                throw new Error('Connection request is already pending. Please check MetaMask.');
            } else {
                throw new Error(error.message || 'Failed to connect to MetaMask. Please try again.');
            }
        }
    };

    return (
        <div>
            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0" />
                    <div>
                        <div className="text-red-400 font-semibold">Connection Error</div>
                        <div className="text-gray-400 text-sm">{error}</div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-1 gap-6">
                {wallets.map((wallet) => (
                    <button
                        key={wallet.id}
                        onClick={() => handleWalletConnect(wallet.id)}
                        disabled={isConnecting || !wallet.isAvailable}
                        className={`relative group ${isConnecting && selectedWallet === wallet.id ? 'opacity-75' : ''
                            } ${!wallet.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 group-hover:scale-105">
                            <div className={`mb-4 flex justify-center ${wallet.color}`}>
                                {wallet.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{wallet.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{wallet.description}</p>

                            {!wallet.isAvailable ? (
                                <div className="text-red-400 font-semibold text-sm">
                                    Not Available - Install {wallet.name}
                                </div>
                            ) : isConnecting && selectedWallet === wallet.id ? (
                                <div className="flex items-center justify-center gap-2 text-cyan-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                                    <span>Connecting...</span>
                                </div>
                            ) : (
                                <div className="text-cyan-400 font-semibold">Connect →</div>
                            )}
                        </div>
                    </button>
                ))}

                {/* Install MetaMask Notice */}
                {!wallets.some(w => w.isAvailable) && (
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="text-center">
                            <FaWallet className="text-blue-400 text-3xl mx-auto mb-3" />
                            <h3 className="text-blue-400 font-semibold mb-2">Install MetaMask</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                To use AnonWhistle, you need a crypto wallet. MetaMask is the most popular choice.
                            </p>
                            <a
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                                <FaWallet />
                                Install MetaMask
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
