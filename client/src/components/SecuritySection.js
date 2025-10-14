'use client';

import { FaCheckCircle, FaLock, FaShieldAlt, FaUserSecret } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

export default function SecuritySection() {
    const securityFeatures = [
        'No registration or personal information required',
        'Tor routing prevents IP tracking',
        'Zero-knowledge architecture',
        'Decentralized storage prevents data seizure',
        'End-to-end encryption on all communications',
        'Anonymous case tracking tokens'
    ];

    const trustBadges = [
        { icon: <FaShieldAlt />, label: 'Protected' },
        { icon: <MdVerified />, label: 'Verified' },
        { icon: <FaUserSecret />, label: 'Anonymous' },
        { icon: <FaLock />, label: 'Encrypted' }
    ];

    return (
        <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Your Identity Is Our Priority
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            We employ multiple layers of security to ensure absolute anonymity and protection for whistleblowers.
                        </p>

                        <div className="space-y-4">
                            {securityFeatures.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-400 text-xl mt-1 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {trustBadges.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-transform"
                            >
                                <div className="text-5xl text-cyan-400 mb-4 flex justify-center">
                                    {item.icon}
                                </div>
                                <div className="text-white font-semibold">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
