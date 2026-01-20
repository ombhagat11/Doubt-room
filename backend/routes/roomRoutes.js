const express = require('express');
const {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomStats
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getRooms)
    .post(protect, authorize('mentor', 'admin'), createRoom);

router.route('/:id')
    .get(protect, getRoom)
    .put(protect, updateRoom)
    .delete(protect, deleteRoom);

router.get('/:id/stats', protect, getRoomStats);

module.exports = router;
