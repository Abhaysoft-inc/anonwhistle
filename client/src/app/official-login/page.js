'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OfficialLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login:', { email, password, role });
        alert(`Login successful!\nEmail: ${email}\nRole: ${role}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Official Login</h1>
                    <p className="text-gray-400">Sign in to access your dashboard</p>
                    <Link href="/" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
                        ← Back to Home
                    </Link>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="officer@gov.in"
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                            >
                                <option value="">Select your role</option>
                                <option value="admin">System Administrator</option>
                                <option value="investigator">Investigating Officer</option>
                                <option value="department_head">Department Head</option>
                                <option value="auditor">Compliance Auditor</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-blue-400 hover:underline text-sm">
                            Forgot password?
                        </a>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        This portal is for authorized government officials only.<br />
                        All login attempts are logged and monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
