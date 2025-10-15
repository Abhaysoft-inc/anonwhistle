'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaWallet, FaEthereum } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiWallet3Fill } from 'react-icons/ri';

export default function WalletSelector({ onWalletConnect }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const wallets = [
        {
            id: 'metamask',
            name: 'MetaMask',
            icon: <Image src="/MetaMask_Fox.svg.png" alt="MetaMask" width={80} height={80} className="rounded-lg" />,
            color: 'text-orange-400',
            description: 'Connect with MetaMask wallet'
        },
        {
            id: 'tor',
            name: 'Tor Browser',
            icon: <Image src="/512px-Tor_Browser_icon.svg.png" alt="Tor Browser" width={80} height={80} className="rounded-lg" />,
            color: 'text-purple-400',
            description: 'Connect via Tor Browser for anonymity'
        },

    ];

    const handleWalletConnect = async (walletId) => {
        setSelectedWallet(walletId);
        setIsConnecting(true);

        // Simulate wallet connection
        setTimeout(() => {
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
            const wallet = wallets.find(w => w.id === walletId);
            onWalletConnect(mockAddress, wallet);
            setIsConnecting(false);
        }, 2000);
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
                <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet.id)}
                    disabled={isConnecting}
                    className={`relative group ${isConnecting && selectedWallet === wallet.id ? 'opacity-75' : ''
                        }`}
                >
                    <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 group-hover:scale-105">
                        <div className={`mb-4 flex justify-center ${wallet.color}`}>
                            {wallet.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{wallet.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{wallet.description}</p>
                        {isConnecting && selectedWallet === wallet.id ? (
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
        </div>
    );
}
