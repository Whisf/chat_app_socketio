const User = require('../models/user.model')

/**
 * 
 * @param {String} username 
 * @returns {User}
 */
const createUser = async (username) => {
    const user = await User.create({name: username})
    return user
}

/**
 * 
 * @param {String} userId 
 * @returns {User}
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId)
    return user
}

/**
 * 
 * @param {String} userName 
 * @returns {User}
 */
const getUserByName = async(userName) => {
    const user = await User.findOne({name: userName});
    return user
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