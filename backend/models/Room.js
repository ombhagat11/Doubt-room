const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Room title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        enum: ['DSA', 'React', 'Node.js', 'MongoDB', 'System Design', 'DBMS', 'OS', 'Networks', 'JavaScript', 'Python', 'Java', 'Other'],
        default: 'Other'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activeUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    activeCount: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    resolvedQuestions: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
roomSchema.index({ topic: 1, isActive: 1 });
roomSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Room', roomSchema);
