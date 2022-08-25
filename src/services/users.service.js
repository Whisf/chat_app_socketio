const User = require('../models/user.model')

/**
 * 
 * @param {String} username 
 * @returns {User}
 */
const createUser = async (username, password) => {
    const isExistUser = await getUserByName(username)
    if (isExistUser) {
        throw new Error('UserName is existed!')
    }
    let user;
    try {
        user = await User.create({name: username, message: null, password: password})
    } catch (error) {
        return error
    }
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
    try {
        const user = await User.findOne({name: userName});
        return user
    } catch (error) {
        throw new Error(error)
    }

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