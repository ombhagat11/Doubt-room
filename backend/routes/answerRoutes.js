const express = require('express');
const {
    getAnswersByQuestion,
    createAnswer,
    voteAnswer,
    acceptAnswer,
    deleteAnswer
} = require('../controllers/answerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createAnswer);
router.get('/question/:questionId', protect, getAnswersByQuestion);
router.put('/:id/vote', protect, voteAnswer);
router.put('/:id/accept', protect, acceptAnswer);
router.delete('/:id', protect, deleteAnswer);

module.exports = router;
