const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Answer text is required'],
        trim: true,
        minlength: [5, 'Answer must be at least 5 characters'],
        maxlength: [2000, 'Answer cannot exceed 2000 characters']
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isAccepted: {
        type: Boolean,
        default: false
    },
    isByMentor: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for sorting by votes
answerSchema.index({ questionId: 1, votes: -1 });
answerSchema.index({ userId: 1 });

module.exports = mongoose.model('Answer', answerSchema);
