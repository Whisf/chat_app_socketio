const httpStatus = require("http-status");
const { roomServices } = require('../services/index')
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/responseTemp");


const createRoom = catchAsync(async(req, res) => {
    const roomBody = {
        users: [req.body.userId],
        name: req.body.roomName
    }

    const room = await roomServices.createRoom(roomBody)
    res.send(response(httpStatus.OK, 'Create Room Success!', room))
})

const getRoomAndMess = catchAsync(async(req, res) => {
    const roomAndMessage = await roomServices.getRoomAndMessages(req.params.room)

    res.send(response(httpStatus.OK, 'Get room success!', roomAndMessage))
})

module.exports = {
    createRoom,
    getRoomAndMess
}
