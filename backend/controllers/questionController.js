const Question = require('../models/Question');
const Room = require('../models/Room');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get questions in a room
// @route   GET /api/questions/room/:roomId
// @access  Private
exports.getQuestionsByRoom = asyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const { resolved, sort } = req.query;

    const filter = { roomId };
    if (resolved !== undefined) {
        filter.isResolved = resolved === 'true';
    }

    let sortOption = { isPinned: -1, createdAt: -1 }; // Pinned first, then newest
    if (sort === 'oldest') sortOption = { isPinned: -1, createdAt: 1 };

    const questions = await Question.find(filter)
        .populate('userId', 'name role reputation')
        .populate('resolvedBy', 'name role')
        .sort(sortOption)
        .limit(100);

    res.status(200).json({
        success: true,
        count: questions.length,
        data: questions
    });
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
        .populate('userId', 'name role reputation')
        .populate('resolvedBy', 'name role');

    if (!question) {
        return next(new ErrorResponse('Question not found', 404));
    }

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc    Create question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
    const { roomId, text, priority, image } = req.body;

    // Verify room exists and is active
    const room = await Room.findOne({ _id: roomId, isActive: true });
    if (!room) {
        return next(new ErrorResponse('Active room not found', 404));
    }

    const question = await Question.create({
        roomId,
        userId: req.user.id,
        text,
        priority: priority || 'medium',
        image: image || null
    });

    // Update room stats in background or use session for atomicity if critical
    // Using atomic updates for performance
    await Room.findByIdAndUpdate(roomId, { $inc: { totalQuestions: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $inc: { questionsAsked: 1 } });

    const populatedQuestion = await Question.findById(question._id)
        .populate('userId', 'name role reputation');

    res.status(201).json({
        success: true,
        data: populatedQuestion
    });
});

// @desc    Mark question as resolved
// @route   PUT /api/questions/:id/resolve
// @access  Private (Mentor/Admin/Question Owner)
exports.resolveQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(new ErrorResponse('Question not found', 404));
    }

    // Check authorization
    const isMentorOrAdmin = ['mentor', 'admin'].includes(req.user.role);
    const isOwner = question.userId.toString() === req.user.id;

    if (!isMentorOrAdmin && !isOwner) {
        return next(new ErrorResponse('Not authorized to resolve this question', 403));
    }

    if (question.isResolved) {
        return next(new ErrorResponse('Question is already resolved', 400));
    }

    question.isResolved = true;
    question.resolvedBy = req.user.id;
    question.resolvedAt = Date.now();
    await question.save();

    // Atomic updates for stats
    await Room.findByIdAndUpdate(question.roomId, { $inc: { resolvedQuestions: 1 } });
    await User.findByIdAndUpdate(question.userId, { 
        $inc: { questionsResolved: 1, reputation: 5 } 
    });

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc    Pin/Unpin question
// @route   PUT /api/questions/:id/pin
// @access  Private (Mentor/Admin)
exports.togglePinQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(new ErrorResponse('Question not found', 404));
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Owner/Admin)
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(new ErrorResponse('Question not found', 404));
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isOwner = question.userId.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
        return next(new ErrorResponse('Not authorized to delete this question', 403));
    }

    // Adjust room stats if deleting unresolved question
    if (!question.isResolved) {
        await Room.findByIdAndUpdate(question.roomId, { $inc: { totalQuestions: -1 } });
    } else {
        await Room.findByIdAndUpdate(question.roomId, { 
            $inc: { totalQuestions: -1, resolvedQuestions: -1 } 
        });
    }

    await question.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

