const express = require('express')
const roomController = require('../controllers/room.controller')
const router = express.Router();

router.route('/').post(roomController.createRoom);

module.exports = router