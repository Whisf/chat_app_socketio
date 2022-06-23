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

const getRoomById = catchAsync(async(req, res) => {

})

module.exports = {
    createRoom,
    getRoomById
}
