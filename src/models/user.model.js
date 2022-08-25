const mongoose = require('mongoose');
const Messages = require('./message.model')
const bcrypt = require('bcrypt')

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }],
    password: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'users'
})

UserModel.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(8, function(err, salt) {
        if (err) {
            return next(err);
        } 
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserModel.methods.comparePassword = function(candidatePassword, next) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Users', UserModel)