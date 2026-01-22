const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Room = require('../models/Room');
const Question = require('../models/Question');

// @desc    Get all active rooms
// @route   GET /api/rooms
// @access  Private
exports.getRooms = asyncHandler(async (req, res, next) => {
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
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id)
        .populate('createdBy', 'name role')
        .populate('activeUsers', 'name role');

    if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: room
    });
});

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Mentor/Admin)
exports.createRoom = asyncHandler(async (req, res, next) => {
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
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Creator/Admin)
exports.updateRoom = asyncHandler(async (req, res, next) => {
    let room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    // Check ownership or admin
    if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this room`, 403));
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: room
    });
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Creator/Admin)
exports.deleteRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    // Check ownership or admin
    if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this room`, 403));
    }

    // Soft delete
    room.isActive = false;
    await room.save();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get room statistics
// @route   GET /api/rooms/:id/stats
// @access  Private
exports.getRoomStats = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
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
});
