const Message = require('../models/message.model');
const {getRoomByName} = require('./room.service')

/**
 * 
 * @param {String} userId 
 * @param {String} message 
 * @param {String} room 
 * @returns {Message}
 */
const saveMessage = (userId, message, room) => {
    return Message.create({
        text: message,
        sendedBy: userId,
        room: room
    })
}

/**
 * 
 * @param {String} roomName 
 * @param {Number} skip 
 * @returns {Object}
 */
const getMessages = async (roomName, skip) => {
    const room = await getRoomByName(roomName);
    skip = skip * 20
    const listMessages = await Message.find(
            { room: room._id },
            { text: 1, createdAt: 1, sendedBy: 1 }, 
            { sort: {createdAt: 1 }, 
            limit: 1000, 
            skip: 0
        })
        .populate('sendedBy', 'name')
        .exec();
    return listMessages.map((message) => {
        const {text, sendedBy, createdAt } = message
        const userName = sendedBy.name
        return {
            text,
            username: userName,
            createdAt
        }
    })
}

/**
 * 
 * @param {String} username 
 * @param {String} text 
 * @returns {Array}
 */
const generateMessage = (username, text) => {
    return [{
        username,
        text,
        createdAt: new Date().getTime()
    }]
}

module.exports = {
    generateMessage,
    saveMessage,
    getMessages
}