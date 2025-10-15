const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Ethereum address validation (40 hex characters prefixed with 0x)
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: 'Invalid wallet address format'
        }
    },
    username: {
        type: String,
        trim: true,
        maxlength: 50,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 1
    },
    // User preferences
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['dark', 'light'],
            default: 'dark'
        }
    },
    // Security metadata
    security: {
        registrationIP: {
            type: String,
            default: null // We don't store IPs for anonymity
        },
        registrationUserAgent: {
            type: String,
            default: null // We don't store user agents for anonymity
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // Remove sensitive fields from JSON output
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes for performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ createdAt: -1 });

// Methods
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    this.loginCount += 1;
    return this.save();
};

userSchema.methods.generateAnonymousUsername = function () {
    if (!this.username) {
        // Generate anonymous username from wallet address
        const prefix = 'Anon';
        const suffix = this.walletAddress.slice(-6).toUpperCase();
        this.username = `${prefix}${suffix}`;
    }
    return this.username;
};

// Static methods
userSchema.statics.findByWalletAddress = function (walletAddress) {
    return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

userSchema.statics.createUser = function (walletAddress, username = null) {
    const userData = {
        walletAddress: walletAddress.toLowerCase(),
        username
    };

    const user = new this(userData);
    if (!username) {
        user.generateAnonymousUsername();
    }

    return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;