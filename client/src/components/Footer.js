'use client';

import { FaShieldAlt } from 'react-icons/fa';

export default function Footer() {
    const footerLinks = {
        platform: [
            { label: 'Submit Report', href: '#' },
            { label: 'Track Case', href: '#' },
            { label: 'Statistics', href: '#' }
        ],
        resources: [
            { label: 'Documentation', href: '#' },
            { label: 'Security Guide', href: '#' },
            { label: 'FAQ', href: '#' }
        ],
        legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Whistleblower Protection', href: '#' }
        ]
    };

    return (
        <footer id="contact" className="bg-black/40 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <FaShieldAlt className="text-3xl text-cyan-400" />
                            <span className="text-2xl font-bold text-white">AnonWhistle</span>
                        </div>
                        <p className="text-gray-400">
                            Empowering transparency through anonymity.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400">
                            {footerLinks.platform.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-cyan-400 transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-gray-400">
                            {footerLinks.resources.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-cyan-400 transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-400">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-cyan-400 transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 AnonWhistle. Fighting corruption with technology. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
