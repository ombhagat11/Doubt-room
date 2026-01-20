const Room = require('../models/Room');
const Question = require('../models/Question');

// @desc    Get all active rooms
// @route   GET /api/rooms
// @access  Private
exports.getRooms = async (req, res) => {
    try {
        const { topic, isPublic } = req.query;

        const filter = { isActive: true };
        if (topic) filter.topic = topic;
        if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

        const rooms = await Room.find(filter)
            .populate('createdBy', 'name role')
            .sort({ activeCount: -1, createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('createdBy', 'name role')
            .populate('activeUsers', 'name role');

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Mentor/Admin)
exports.createRoom = async (req, res) => {
    try {
        const { title, topic, description, isPublic } = req.body;

        const room = await Room.create({
            title,
            topic,
            description,
            isPublic: isPublic !== undefined ? isPublic : true,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Creator/Admin)
exports.updateRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Check ownership or admin
        if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this room'
            });
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Creator/Admin)
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Check ownership or admin
        if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this room'
            });
        }

        // Soft delete
        room.isActive = false;
        await room.save();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get room statistics
// @route   GET /api/rooms/:id/stats
// @access  Private
exports.getRoomStats = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        const totalQuestions = await Question.countDocuments({ roomId: req.params.id });
        const resolvedQuestions = await Question.countDocuments({
            roomId: req.params.id,
            isResolved: true
        });
        const pendingQuestions = totalQuestions - resolvedQuestions;

        res.status(200).json({
            success: true,
            data: {
                totalQuestions,
                resolvedQuestions,
                pendingQuestions,
                activeUsers: room.activeCount,
                resolutionRate: totalQuestions > 0 ? ((resolvedQuestions / totalQuestions) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
