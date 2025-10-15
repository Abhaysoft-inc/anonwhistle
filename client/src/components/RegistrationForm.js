'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaShieldAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { authAPI, storage } from '@/utils/api';

export default function RegistrationForm({ walletAddress, selectedWallet, onDisconnect }) {
    const [username, setUsername] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Register with wallet address
            const response = await authAPI.registerWithWallet(
                walletAddress,
                username.trim() || null
            );

            if (response.success) {
                // Store auth data
                storage.setAuthToken(response.token);
                storage.setUserData(response.user);

                // Show success message
                console.log('Registration successful:', response.message);

                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                {/* Success Message */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <FaCheckCircle className="text-green-400 text-2xl flex-shrink-0" />
                    <div>
                        <div className="text-green-400 font-semibold">Wallet Connected</div>
                        <div className="text-gray-400 text-sm font-mono">
                            {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Complete Your Registration
                </h2>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                        <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0" />
                        <div>
                            <div className="text-red-400 font-semibold">Registration Error</div>
                            <div className="text-gray-400 text-sm">{error}</div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Anonymous Username (Optional)
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a pseudonym or leave blank for auto-generated"
                            disabled={isSubmitting}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition disabled:opacity-50"
                            maxLength={50}
                        />
                        <p className="text-gray-400 text-sm mt-2">
                            This will be used as your display name. Leave blank for an auto-generated anonymous ID.
                        </p>
                    </div>

                    {/* Wallet Info */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Connected Wallet
                        </label>
                        <div className="bg-black/30 border border-white/10 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-cyan-400">{selectedWallet?.icon}</div>
                                    <div>
                                        <div className="text-white font-semibold">{selectedWallet?.name}</div>
                                        <div className="text-gray-400 text-sm font-mono">
                                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onDisconnect}
                                    className="text-red-400 hover:text-red-300 text-sm transition"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-400"
                            />
                            <span className="text-gray-300 text-sm group-hover:text-white transition">
                                I agree to the{' '}
                                <a href="#" className="text-cyan-400 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-cyan-400 hover:underline">
                                    Privacy Policy
                                </a>
                                . I understand that my wallet address will be used for authentication only.
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!agreedToTerms || isSubmitting}
                        className={`w-full py-4 rounded-full font-bold text-lg transition-all ${agreedToTerms && !isSubmitting
                                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    Complete Anonymous Registration
                                </>
                            )}
                        </div>
                    </button>
                </form>

                {/* Security Notice */}
                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <FaShieldAlt className="text-cyan-400 text-xl flex-shrink-0 mt-1" />
                            <div className="text-sm">
                                <div className="text-cyan-400 font-semibold mb-1">
                                    Your Privacy is Protected
                                </div>
                                <div className="text-gray-400">
                                    We only store your wallet address for authentication. No personal information,
                                    IP addresses, or tracking data is collected. All submissions remain completely anonymous.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
