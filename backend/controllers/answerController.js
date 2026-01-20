const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Private
exports.getAnswersByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const answers = await Answer.find({ questionId })
            .populate('userId', 'name role reputation')
            .sort({ isAccepted: -1, votes: -1, createdAt: -1 }); // Accepted first, then by votes

        res.status(200).json({
            success: true,
            count: answers.length,
            data: answers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create answer
// @route   POST /api/answers
// @access  Private
exports.createAnswer = async (req, res) => {
    try {
        const { questionId, text } = req.body;

        // Verify question exists
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const isByMentor = ['mentor', 'admin'].includes(req.user.role);

        const answer = await Answer.create({
            questionId,
            userId: req.user.id,
            text,
            isByMentor
        });

        // Update question answer count
        question.answerCount += 1;
        await question.save();

        // Update user stats
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { answersGiven: 1, reputation: 2 }
        });

        const populatedAnswer = await Answer.findById(answer._id)
            .populate('userId', 'name role reputation');

        res.status(201).json({
            success: true,
            data: populatedAnswer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Upvote/Downvote answer
// @route   PUT /api/answers/:id/vote
// @access  Private
exports.voteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        const userId = req.user.id;
        const hasVoted = answer.votedBy.includes(userId);

        if (hasVoted) {
            // Remove vote
            answer.votedBy = answer.votedBy.filter(id => id.toString() !== userId);
            answer.votes -= 1;

            // Decrease answerer's reputation
            await User.findByIdAndUpdate(answer.userId, {
                $inc: { reputation: -1 }
            });
        } else {
            // Add vote
            answer.votedBy.push(userId);
            answer.votes += 1;

            // Increase answerer's reputation
            await User.findByIdAndUpdate(answer.userId, {
                $inc: { reputation: 1 }
            });
        }

        await answer.save();

        res.status(200).json({
            success: true,
            data: answer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark answer as accepted
// @route   PUT /api/answers/:id/accept
// @access  Private (Question Owner/Mentor/Admin)
exports.acceptAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        const question = await Question.findById(answer.questionId);

        // Check authorization
        const isMentorOrAdmin = ['mentor', 'admin'].includes(req.user.role);
        const isQuestionOwner = question.userId.toString() === req.user.id;

        if (!isMentorOrAdmin && !isQuestionOwner) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this answer'
            });
        }

        // Unaccept all other answers for this question
        await Answer.updateMany(
            { questionId: answer.questionId },
            { isAccepted: false }
        );

        // Accept this answer
        answer.isAccepted = true;
        await answer.save();

        // Give bonus reputation to answerer
        await User.findByIdAndUpdate(answer.userId, {
            $inc: { reputation: 10 }
        });

        res.status(200).json({
            success: true,
            data: answer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private (Owner/Admin)
exports.deleteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = answer.userId.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this answer'
            });
        }

        // Update question answer count
        await Question.findByIdAndUpdate(answer.questionId, {
            $inc: { answerCount: -1 }
        });

        await answer.deleteOne();

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
