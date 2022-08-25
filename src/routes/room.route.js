const express = require('express')
const roomController = require('../controllers/room.controller')
const auth = require('../middlewares/auth')
const router = express.Router();

router.route('/').post(roomController.createRoom);
router.route('/:room').get(roomController.getRoomAndMess)

module.exports = router