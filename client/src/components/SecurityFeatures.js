'use client';

import { FaCheckCircle, FaShieldAlt, FaUserSecret } from 'react-icons/fa';

export default function SecurityFeatures() {
    const features = [
        {
            icon: <FaShieldAlt className="text-2xl text-green-400" />,
            title: 'Complete Anonymity',
            desc: 'No email or personal data'
        },
        {
            icon: <FaCheckCircle className="text-2xl text-blue-400" />,
            title: 'Verified Identity',
            desc: 'Cryptographic proof'
        },
        {
            icon: <FaUserSecret className="text-2xl text-purple-400" />,
            title: 'Privacy First',
            desc: 'Untraceable registration'
        }
    ];

    return (
        <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Why Crypto Wallet Registration?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                        <div className="mt-1">{feature.icon}</div>
                        <div>
                            <div className="text-white font-semibold text-sm">{feature.title}</div>
                            <div className="text-gray-400 text-xs">{feature.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
