const mongoose = require('mongoose')
const Messages = require('./message.model')

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    users: {
        type: Array
    },
    messages: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Messages' 
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    collection: "chatrooms"
});

module.exports = mongoose.model('Room', RoomSchema);