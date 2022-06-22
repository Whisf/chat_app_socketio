const mongoose = require('mongoose')
const Messages = require('./message.model')

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    users: {
        type: Array
    },
    messages: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Messages' 
    }],
}, {
    timestamps: true,
    collection: "chatrooms"
});

module.exports = mongoose.model('Room', RoomSchema);