const express = require('express')
const roomRouter = require('./room.route')
const messageRouter = require('./message.route')
const userRouter = require('./user.route')
const authRouter = require('./auth.route')

const router = express.Router()

router.use('/rooms', roomRouter)
router.use('/messages', messageRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)

module.exports = router