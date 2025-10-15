const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: 'Access denied',
            message: 'No token provided'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Invalid token',
            message: 'Token verification failed'
        });
    }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } catch (error) {
            // Token invalid but continue anyway
            req.user = null;
        }
    }

    next();
};

// Wallet address validation middleware
const validateWalletAddress = (req, res, next) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({
            error: 'Wallet address required',
            message: 'Wallet address is required for authentication'
        });
    }

    // Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(walletAddress)) {
        return res.status(400).json({
            error: 'Invalid wallet address',
            message: 'Please provide a valid Ethereum wallet address'
        });
    }

    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth,
    validateWalletAddress
};