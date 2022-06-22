const mongoose = require('mongoose');
const Users = require('./user.model')

const MessageModel = new mongoose.Schema({
    text: {
        type: String
    },
    sendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    sendedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'messages'
})

module.exports = mongoose.model('Messages', MessageModel)