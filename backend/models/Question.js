const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
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
        required: [true, 'Question text is required'],
        trim: true,
        minlength: [5, 'Question must be at least 5 characters'],
        maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    },
    answerCount: {
        type: Number,
        default: 0
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    image: {
        type: String, // Base64 encoded image or URL
        default: null
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
questionSchema.index({ roomId: 1, isResolved: 1, createdAt: -1 });
questionSchema.index({ userId: 1 });

module.exports = mongoose.model('Question', questionSchema);
