const express = require('express');
const {
    getQuestionsByRoom,
    getQuestion,
    createQuestion,
    resolveQuestion,
    togglePinQuestion,
    deleteQuestion
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');
const { questionLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', protect, questionLimiter, createQuestion);
router.get('/room/:roomId', protect, getQuestionsByRoom);
router.get('/:id', protect, getQuestion);
router.put('/:id/resolve', protect, resolveQuestion);
router.put('/:id/pin', protect, authorize('mentor', 'admin'), togglePinQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
