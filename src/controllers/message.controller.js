const httpStatus = require('http-status');
const { addMessage, getMessages } = require('../services/messages');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/responseTemp')


const addNewMess = catchAsync(async(req, res) => {
    const message = await addMessage(req.body.userId, req.body.message, req.roomId)
    res.send(response(httpStatus.CREATED, 'Created Message!', message))
})

const getAllMess = catchAsync(async(req, res) => {
    const skip = 1
    const messages = await getMessages(req.body.roomId, skip)
    res.send(response(httpStatus.OK, 'OK', messages))
})

module.exports = {
    addNewMess, 
    getAllMess
}