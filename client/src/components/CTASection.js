'use client';

import Link from 'next/link';
import { FaRocket } from 'react-icons/fa';

export default function CTASection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                    <FaRocket className="text-6xl text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of whistleblowers fighting corruption with complete anonymity and security.
                    </p>
                    <Link href="/register">
                        <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105">
                            Start Your Anonymous Report
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
