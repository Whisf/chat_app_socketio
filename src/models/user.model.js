const mongoose = require('mongoose');
const Messages = require('./message.model')

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users'
})

module.exports = mongoose.model('Users', UserModel)