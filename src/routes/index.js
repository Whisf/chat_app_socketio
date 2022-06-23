const express = require('express')
const roomRouter = require('./room.route')
const messageRouter = require('./message.route')

const router = express.Router()

router.use('/rooms', roomRouter)
router.use('/messages', messageRouter)

module.exports = router