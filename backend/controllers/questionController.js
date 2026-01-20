const Question = require('../models/Question');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get questions in a room
// @route   GET /api/questions/room/:roomId
// @access  Private
exports.getQuestionsByRoom = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('userId', 'name role reputation')
            .populate('resolvedBy', 'name role');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res) => {
    try {
        const { roomId, text, priority, image } = req.body;

        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room || !room.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Room not found or inactive'
            });
        }

        const question = await Question.create({
            roomId,
            userId: req.user.id,
            text,
            priority: priority || 'medium',
            image: image || null
        });

        // Update room stats
        room.totalQuestions += 1;
        await room.save();

        // Update user stats
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { questionsAsked: 1 }
        });

        const populatedQuestion = await Question.findById(question._id)
            .populate('userId', 'name role reputation');

        res.status(201).json({
            success: true,
            data: populatedQuestion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark question as resolved
// @route   PUT /api/questions/:id/resolve
// @access  Private (Mentor/Admin/Question Owner)
exports.resolveQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check authorization
        const isMentorOrAdmin = ['mentor', 'admin'].includes(req.user.role);
        const isOwner = question.userId.toString() === req.user.id;

        if (!isMentorOrAdmin && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to resolve this question'
            });
        }

        question.isResolved = true;
        question.resolvedBy = req.user.id;
        question.resolvedAt = Date.now();
        await question.save();

        // Update room stats
        await Room.findByIdAndUpdate(question.roomId, {
            $inc: { resolvedQuestions: 1 }
        });

        // Update user stats
        await User.findByIdAndUpdate(question.userId, {
            $inc: { questionsResolved: 1, reputation: 5 }
        });

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Pin/Unpin question
// @route   PUT /api/questions/:id/pin
// @access  Private (Mentor/Admin)
exports.togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Owner/Admin)
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = question.userId.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this question'
            });
        }

        await question.deleteOne();

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
