'use client';

import { useState } from 'react';
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
            icon: <RiWallet3Fill className="text-5xl" />,
            color: 'from-orange-500 to-orange-600',
            description: 'Connect with MetaMask wallet'
        },
        {
            id: 'walletconnect',
            name: 'WalletConnect',
            icon: <MdAccountBalanceWallet className="text-5xl" />,
            color: 'from-blue-500 to-blue-600',
            description: 'Connect via WalletConnect protocol'
        },
        {
            id: 'coinbase',
            name: 'Coinbase Wallet',
            icon: <FaWallet className="text-5xl" />,
            color: 'from-indigo-500 to-indigo-600',
            description: 'Connect with Coinbase Wallet'
        },
        {
            id: 'ethereum',
            name: 'Ethereum Wallet',
            icon: <FaEthereum className="text-5xl" />,
            color: 'from-purple-500 to-purple-600',
            description: 'Connect any Ethereum wallet'
        }
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
                    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 group-hover:scale-105">
                        <div className={`bg-gradient-to-r ${wallet.color} bg-clip-text text-transparent mb-4 flex justify-center`}>
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
