const Message = require('../models/message.model');
// const {getRoomByName} = require('./room.service')

/**
 * 
 * @param {String} userId 
 * @param {String} message 
 * @param {String} room 
 * @returns {Message}
 */
const addMessage = (userId, message, room) => {
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
const getMessages = async (room, skip = 1) => {
    const messagePerTime = 20
    const listMessages = await Message.find(
            { room: room },
            { text: 1, createdAt: 1, sendedBy: 1 }, 
            { sort: {createdAt: -1 }, 
            limit: messagePerTime, 
            skip: (skip * messagePerTime) - messagePerTime
        })
        .populate('sendedBy', 'name')
        .exec();
    
    if(!listMessages) return [];
    console.log("🚀 ~ file: messages.js ~ line 38 ~ getMessages ~ listMessages", listMessages)
    return listMessages.reverse().map((message) => {
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
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    addMessage,
    getMessages
}