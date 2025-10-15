const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authenticateToken, optionalAuth } = require('../config/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/evidence');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * @route   POST /api/complaints
 * @desc    Submit a new complaint
 * @access  Private
 */
router.post('/', authenticateToken, upload.array('evidence', 5), async (req, res) => {
    try {
        const { title, description, department, category, priority } = req.body;

        // Validate required fields
        if (!title || !description || !department) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Title, description, and department are required'
            });
        }

        // Process evidence files
        const evidence = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                evidence.push({
                    type: file.mimetype.startsWith('image/') ? 'image' : 'document',
                    filename: file.filename,
                    originalName: file.originalname,
                    size: file.size,
                    uploadedAt: new Date()
                });
            }
        }

        // Create complaint
        const complaint = new Complaint({
            title: title.trim(),
            description: description.trim(),
            department,
            category: category || 'corruption',
            priority: priority || 'medium',
            submittedBy: req.user.id,
            walletAddress: req.user.walletAddress,
            evidence
        });

        await complaint.save();

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            complaint: {
                id: complaint._id,
                complaintId: complaint.complaintId,
                title: complaint.title,
                department: complaint.department,
                status: complaint.status,
                priority: complaint.priority,
                createdAt: complaint.createdAt
            }
        });

    } catch (error) {
        console.error('Complaint submission error:', error);

        // Clean up uploaded files if complaint creation fails
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }

        res.status(500).json({
            error: 'Complaint submission failed',
            message: 'Could not submit complaint. Please try again.'
        });
    }
});

/**
 * @route   GET /api/complaints
 * @desc    Get user's complaints
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, department } = req.query;

        // Build filter
        const filter = { submittedBy: req.user.id };
        if (status) filter.status = status;
        if (department) filter.department = department;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-submittedBy -evidence.storageRef -investigation.notes');

        const total = await Complaint.countDocuments(filter);

        res.json({
            success: true,
            complaints,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalComplaints: total,
                hasNext: skip + parseInt(limit) < total,
                hasPrev: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Complaints fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch complaints'
        });
    }
});

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint details
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            submittedBy: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                error: 'Complaint not found',
                message: 'Complaint not found or access denied'
            });
        }

        // Increment view count
        await complaint.incrementViews();

        res.json({
            success: true,
            complaint
        });

    } catch (error) {
        console.error('Complaint fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch complaint details'
        });
    }
});

/**
 * @route   PUT /api/complaints/:id
 * @desc    Update complaint (limited fields)
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const complaint = await Complaint.findOne({
            _id: req.params.id,
            submittedBy: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                error: 'Complaint not found'
            });
        }

        // Only allow updates if complaint is still pending
        if (complaint.status !== 'pending') {
            return res.status(400).json({
                error: 'Cannot update complaint',
                message: 'Only pending complaints can be updated'
            });
        }

        // Update allowed fields
        if (title) complaint.title = title.trim();
        if (description) complaint.description = description.trim();
        if (priority) complaint.priority = priority;

        await complaint.save();

        res.json({
            success: true,
            message: 'Complaint updated successfully',
            complaint
        });

    } catch (error) {
        console.error('Complaint update error:', error);
        res.status(500).json({
            error: 'Failed to update complaint'
        });
    }
});

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete/withdraw complaint
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            submittedBy: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                error: 'Complaint not found'
            });
        }

        // Only allow deletion if complaint is pending
        if (complaint.status !== 'pending') {
            return res.status(400).json({
                error: 'Cannot delete complaint',
                message: 'Only pending complaints can be withdrawn'
            });
        }

        // Delete evidence files
        if (complaint.evidence && complaint.evidence.length > 0) {
            complaint.evidence.forEach(file => {
                const filePath = path.join(__dirname, '../uploads/evidence', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting evidence file:', err);
                });
            });
        }

        await Complaint.findByIdAndDelete(complaint._id);

        res.json({
            success: true,
            message: 'Complaint withdrawn successfully'
        });

    } catch (error) {
        console.error('Complaint deletion error:', error);
        res.status(500).json({
            error: 'Failed to withdraw complaint'
        });
    }
});

/**
 * @route   GET /api/complaints/public/stats
 * @desc    Get public complaint statistics
 * @access  Public
 */
router.get('/public/stats', async (req, res) => {
    try {
        // Overall statistics
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const investigatingComplaints = await Complaint.countDocuments({ status: 'investigating' });

        // Department-wise statistics
        const departmentStats = await Complaint.getStatsByDepartment();

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentComplaints = await Complaint.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            stats: {
                overall: {
                    total: totalComplaints,
                    resolved: resolvedComplaints,
                    pending: pendingComplaints,
                    investigating: investigatingComplaints,
                    resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0,
                    recentActivity: recentComplaints
                },
                departments: departmentStats
            },
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch statistics'
        });
    }
});

/**
 * @route   GET /api/complaints/public/leaderboard
 * @desc    Get department performance leaderboard
 * @access  Public
 */
router.get('/public/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Complaint.aggregate([
            {
                $group: {
                    _id: '$department',
                    totalCases: { $sum: 1 },
                    resolvedCases: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                    avgResolutionTime: {
                        $avg: {
                            $cond: [
                                { $eq: ['$status', 'resolved'] },
                                { $subtract: ['$investigation.resolution.resolvedAt', '$createdAt'] },
                                null
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    department: '$_id',
                    totalCases: 1,
                    resolvedCases: 1,
                    resolutionRate: {
                        $multiply: [{ $divide: ['$resolvedCases', '$totalCases'] }, 100]
                    },
                    avgResolutionDays: {
                        $divide: ['$avgResolutionTime', 1000 * 60 * 60 * 24] // Convert to days
                    }
                }
            },
            {
                $sort: { resolutionRate: -1, avgResolutionDays: 1 }
            }
        ]);

        res.json({
            success: true,
            leaderboard: leaderboard.map((dept, index) => ({
                rank: index + 1,
                department: dept.department,
                totalCases: dept.totalCases,
                resolvedCases: dept.resolvedCases,
                resolutionRate: parseFloat(dept.resolutionRate?.toFixed(1) || 0),
                avgResolutionDays: Math.round(dept.avgResolutionDays || 0),
                score: calculateDepartmentScore(dept.resolutionRate, dept.avgResolutionDays, dept.totalCases)
            }))
        });

    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch leaderboard'
        });
    }
});

// Helper function to calculate department performance score
function calculateDepartmentScore(resolutionRate, avgResolutionDays, totalCases) {
    const rateScore = (resolutionRate || 0) * 0.4; // 40% weight
    const timeScore = Math.max(0, 100 - (avgResolutionDays || 30)) * 0.3; // 30% weight
    const volumeScore = Math.min(100, (totalCases / 10) * 10) * 0.3; // 30% weight

    return parseFloat((rateScore + timeScore + volumeScore).toFixed(1));
}

module.exports = router;