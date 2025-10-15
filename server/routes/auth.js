const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, validateWalletAddress, authenticateToken } = require('../config/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register/Login with wallet address
 * @access  Public
 */
router.post('/register', validateWalletAddress, async (req, res) => {
    try {
        const { walletAddress, username } = req.body;

        // Check if user already exists
        let user = await User.findByWalletAddress(walletAddress);

        if (user) {
            // Update last login for existing user
            await user.updateLastLogin();

            const token = generateToken({
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username
            });

            return res.status(200).json({
                success: true,
                message: 'Welcome back! Logged in successfully.',
                user: {
                    id: user._id,
                    walletAddress: user.walletAddress,
                    username: user.username,
                    lastLogin: user.lastLogin,
                    loginCount: user.loginCount,
                    createdAt: user.createdAt
                },
                token,
                isNewUser: false
            });
        }

        // Create new user
        user = await User.createUser(walletAddress, username);

        const token = generateToken({
            id: user._id,
            walletAddress: user.walletAddress,
            username: user.username
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to AnonWhistle.',
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount,
                createdAt: user.createdAt
            },
            token,
            isNewUser: true
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Wallet already registered',
                message: 'This wallet address is already registered. Try logging in instead.'
            });
        }

        res.status(500).json({
            error: 'Registration failed',
            message: 'An error occurred during registration. Please try again.'
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login with wallet address
 * @access  Public
 */
router.post('/login', validateWalletAddress, async (req, res) => {
    try {
        const { walletAddress } = req.body;

        const user = await User.findByWalletAddress(walletAddress);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'No account found with this wallet address. Please register first.'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: 'Account inactive',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Update last login
        await user.updateLastLogin();

        const token = generateToken({
            id: user._id,
            walletAddress: user.walletAddress,
            username: user.username
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount,
                createdAt: user.createdAt
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            message: 'An error occurred during login. Please try again.'
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-__v');

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User profile not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch profile',
            message: 'Could not retrieve user profile'
        });
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, preferences } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User profile not found'
            });
        }

        // Update allowed fields
        if (username !== undefined) {
            if (username.length > 50) {
                return res.status(400).json({
                    error: 'Username too long',
                    message: 'Username must be 50 characters or less'
                });
            }
            user.username = username.trim() || user.generateAnonymousUsername();
        }

        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username,
                preferences: user.preferences,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            error: 'Profile update failed',
            message: 'Could not update user profile'
        });
    }
});

/**
 * @route   DELETE /api/auth/account
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        // Soft delete - deactivate account instead of deleting
        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'Account deactivated successfully',
            notice: 'Your account has been deactivated. Your data is preserved for security purposes.'
        });

    } catch (error) {
        console.error('Account deactivation error:', error);
        res.status(500).json({
            error: 'Account deactivation failed',
            message: 'Could not deactivate account'
        });
    }
});

/**
 * @route   GET /api/auth/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const Complaint = require('../models/Complaint');

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Get complaint statistics
        const complaintStats = await Complaint.aggregate([
            { $match: { submittedBy: user._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    investigating: { $sum: { $cond: [{ $eq: ['$status', 'investigating'] }, 1, 0] } }
                }
            }
        ]);

        const stats = complaintStats[0] || {
            total: 0,
            resolved: 0,
            pending: 0,
            investigating: 0
        };

        res.json({
            success: true,
            stats: {
                user: {
                    joinDate: user.createdAt,
                    loginCount: user.loginCount,
                    lastLogin: user.lastLogin
                },
                complaints: {
                    total: stats.total,
                    resolved: stats.resolved,
                    pending: stats.pending,
                    investigating: stats.investigating,
                    resolutionRate: stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0
                }
            }
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;