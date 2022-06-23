const Room = require('../models/room.model')
const {getUserByName, createUser, getUserById} =  require('../services/users')

/**
 * Create Room by name
 * @param {String} name 
 * @returns {Room}
 */
const createRoom = async(roomBody) => {
    const room = await Room.create(roomBody)
    return room
}

/**
 * Get room by Id
 * @param {String} id 
 * @returns {Room}
 */
const getRoomById = async (id) => {
    return Room.findById(id)
}

/**
 * 
 * @param {String} name 
 * @returns {Room}
 */
const getRoomByName = async(name) => {
    return Room.findOne({name})
}

/**
 * Add user to room
 * @param {String} userName 
 * @param {String} roomName 
 * @returns {Object}
 */
const addUser = async(userName, roomName) => {
    if(!userName || !roomName) {
        throw new Error('Invalid!')
    }
    const room = await getRoomByName(roomName);
    let user = await getUserByName(userName);
    if(!room) {
        throw new Error(`Not found room name: ${roomName}`)
    }
    if(!user) {
        user = await createUser(userName)
    }

    const userId = user._id.toString()

    if(!room.users.includes(userId)) {
        room.users.push(userId)
        await room.save()
    }
    
    return {
        room: room.name,
        user: user.name,
        userId: userId
    }
}

/**
 * 
 * @param {String} roomName 
 * @returns {Array}
 */
const getUsersInRoom = async (roomName) => {
    const room = await getRoomByName(roomName)
    const listUsers = await room.users.map(async (userid) => {
        const getUser = await getUserById(userid)
        return {username: getUser.name}
    })

    return Promise.all(listUsers)
}

/**
 * 
 * @param {String} roomId 
 * @param {Object} body 
 * @returns {Room}
 */
const updateRoomById = async(roomId, body) => {
    const room = await getRoomById(roomId);
    if(!room) {
        throw new Error('Not found room')
    }
    Object.assign(room, body)
    await room.save()
    return room
}

module.exports = {
    createRoom,
    getRoomById,
    getRoomByName,
    addUser,
    getUsersInRoom,
    updateRoomById
}