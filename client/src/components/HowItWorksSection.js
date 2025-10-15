'use client';

import { FaBrain, FaCheckCircle, FaEthereum } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';

export default function HowItWorksSection() {
    const steps = [
        {
            step: '01',
            icon: <HiOutlineDocumentReport className="text-4xl" />,
            title: 'Submit Report',
            description: 'Securely upload evidence and details via Tor network'
        },
        {
            step: '02',
            icon: <FaBrain className="text-4xl" />,
            title: 'AI Analysis',
            description: 'Our AI categorizes and prioritizes your case automatically'
        },
        {
            step: '03',
            icon: <FaEthereum className="text-4xl" />,
            title: 'Blockchain Storage',
            description: 'Evidence is encrypted and stored on immutable blockchain'
        },
        {
            step: '04',
            icon: <FaCheckCircle className="text-4xl" />,
            title: 'Case Resolution',
            description: 'Authorities investigate and resolve with full transparency'
        }
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-400">
                        Simple, secure, and completely anonymous
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((item, index) => (
                        <div key={index} className="text-center relative">
                            <div className="bg-gray-900/60 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 border-2 border-gray-700">
                                <div className="text-cyan-400">
                                    {item.icon}
                                </div>
                            </div>
                            <div className="text-6xl font-bold text-white/10 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
