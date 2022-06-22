const User = require('../models/user.model')

const createUser = async (username) => {
    return User.create({name: username})
}

const getUserById = async (userId) => {
    return User.findById(userId)
}

const getUserByName = (userName) => {
    return User.findOne({name: userName});
}

const removeUser = (id) => {
    // const index = users.findIndex((user) => user.id === id)

    // if (index !== -1) {
    //     return users.splice(index, 1)[0]
    // }
}

module.exports = {
    removeUser,
    createUser,
    getUserById,
    getUserByName
}