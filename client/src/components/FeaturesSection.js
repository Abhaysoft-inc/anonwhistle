'use client';

import { FaBrain, FaEthereum, FaLock, FaNetworkWired } from 'react-icons/fa';
import { MdSecurity, MdSpeed } from 'react-icons/md';

export default function FeaturesSection() {
    const features = [
        {
            icon: <FaNetworkWired className="text-5xl text-purple-400" />,
            title: 'Tor Network Integration',
            description: 'Route all communications through the Tor network, ensuring complete IP anonymization and untraceable submissions.'
        },
        {
            icon: <FaEthereum className="text-5xl text-cyan-400" />,
            title: 'Blockchain Immutability',
            description: 'Store evidence on decentralized blockchain, making tampering impossible and ensuring permanent record-keeping.'
        },
        {
            icon: <FaBrain className="text-5xl text-pink-400" />,
            title: 'AI Case Analysis',
            description: 'Advanced AI algorithms categorize, prioritize, and route cases efficiently to relevant authorities automatically.'
        },
        {
            icon: <MdSecurity className="text-5xl text-green-400" />,
            title: 'End-to-End Encryption',
            description: 'Military-grade 256-bit encryption ensures your data remains secure from submission to resolution.'
        },
        {
            icon: <FaLock className="text-5xl text-yellow-400" />,
            title: 'Zero-Knowledge Proof',
            description: 'Verify authenticity without revealing identity using cutting-edge cryptographic techniques.'
        },
        {
            icon: <MdSpeed className="text-5xl text-red-400" />,
            title: 'Rapid Response System',
            description: 'AI-powered triage ensures critical corruption cases receive immediate attention from authorities.'
        }
    ];

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Cutting-Edge Technology Stack
                    </h2>
                    <p className="text-xl text-gray-400">
                        Military-grade security meets advanced AI for maximum protection
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 group"
                        >
                            <div className="mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
