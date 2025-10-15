const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    department: {
        type: String,
        required: true,
        enum: [
            'railways',
            'transport',
            'power',
            'health',
            'education',
            'urban',
            'agriculture',
            'labour',
            'finance',
            'environment',
            'other'
        ]
    },
    category: {
        type: String,
        enum: [
            'corruption',
            'bribery',
            'fraud',
            'negligence',
            'misconduct',
            'abuse_of_power',
            'other'
        ],
        default: 'corruption'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'investigating', 'resolved', 'closed', 'rejected'],
        default: 'pending'
    },
    // User information (anonymized)
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletAddress: {
        type: String,
        required: true // For tracking without revealing identity
    },
    // Evidence and attachments
    evidence: [{
        type: {
            type: String,
            enum: ['image', 'document', 'video', 'audio'],
            required: true
        },
        filename: String,
        originalName: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        // Store file hash for integrity verification
        fileHash: String,
        // IPFS or blockchain storage reference
        storageRef: String
    }],
    // Investigation details
    investigation: {
        assignedTo: {
            type: String, // Investigator ID
            default: null
        },
        assignedAt: Date,
        notes: [{
            note: String,
            addedBy: String,
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        resolution: {
            summary: String,
            action_taken: String,
            resolvedAt: Date,
            resolvedBy: String
        }
    },
    // Blockchain integration
    blockchain: {
        transactionHash: String,
        blockNumber: Number,
        contractAddress: String,
        onChain: {
            type: Boolean,
            default: false
        }
    },
    // Analytics and tracking
    analytics: {
        views: {
            type: Number,
            default: 0
        },
        lastViewed: Date,
        publicScore: {
            type: Number,
            default: 0 // Community voting score
        }
    },
    // Privacy settings
    privacy: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowPublicComments: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // Remove sensitive fields from JSON output
            delete ret.__v;
            delete ret.submittedBy;
            // Keep walletAddress partially hidden
            if (ret.walletAddress) {
                ret.walletAddress = ret.walletAddress.slice(0, 6) + '...' + ret.walletAddress.slice(-4);
            }
            return ret;
        }
    }
});

// Indexes
complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ submittedBy: 1 });
complaintSchema.index({ walletAddress: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ 'blockchain.onChain': 1 });

// Pre-save middleware to generate complaint ID
complaintSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Generate unique complaint ID
        const count = await this.constructor.countDocuments();
        this.complaintId = `CMP-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Methods
complaintSchema.methods.addInvestigationNote = function (note, addedBy) {
    this.investigation.notes.push({
        note,
        addedBy,
        addedAt: new Date()
    });
    return this.save();
};

complaintSchema.methods.assignInvestigator = function (investigatorId) {
    this.investigation.assignedTo = investigatorId;
    this.investigation.assignedAt = new Date();
    this.status = 'investigating';
    return this.save();
};

complaintSchema.methods.resolveComplaint = function (resolution, resolvedBy) {
    this.status = 'resolved';
    this.investigation.resolution = {
        ...resolution,
        resolvedAt: new Date(),
        resolvedBy
    };
    return this.save();
};

complaintSchema.methods.incrementViews = function () {
    this.analytics.views += 1;
    this.analytics.lastViewed = new Date();
    return this.save({ validateBeforeSave: false });
};

// Static methods
complaintSchema.statics.findByWallet = function (walletAddress) {
    return this.find({ walletAddress }).sort({ createdAt: -1 });
};

complaintSchema.statics.getStatsByDepartment = function () {
    return this.aggregate([
        {
            $group: {
                _id: '$department',
                total: { $sum: 1 },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                investigating: { $sum: { $cond: [{ $eq: ['$status', 'investigating'] }, 1, 0] } }
            }
        },
        {
            $project: {
                department: '$_id',
                total: 1,
                resolved: 1,
                pending: 1,
                investigating: 1,
                resolutionRate: { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }
            }
        },
        { $sort: { resolutionRate: -1 } }
    ]);
};

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;