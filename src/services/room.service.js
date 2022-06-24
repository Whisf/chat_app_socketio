const Room = require('../models/room.model')
const { getMessages } = require('./messages')
const {getUserByName, createUser, getUserById} =  require('./users.service')

/**
 * Create Room by name
 * @param {String} name 
 * @returns {Room}
 */
const createRoom = async(roomBody) => {
    const room = await Room.create(roomBody).catch((err) => {
        throw new Error(err)
    })
    return room
}

/**
 * Get room by Id
 * @param {String} id 
 * @returns {Room}
 */
const getRoomById = async (id) => {
    const room = await Room.findById(id).then((err) => {
        throw new Error(err.code, err.messages)
    })

    return room
}

/**
 * 
 * @param {String} name 
 * @returns {Room}
 */
const getRoomByName = async(name) => {
    const room = await Room.findOne({name})

    return room
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
    let user = await getUserByName(userName);
    if(!user) {
        user = await createUser(userName)
    }
    let room = await getRoomByName(roomName);
    if(!room) {
        room = await createRoom({name: roomName,  createdBy: user._id, users: [user._id.toString()]})
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
 * @param {String} roomName 
 * @returns {Object}
 */
const getRoomAndMessages = async (roomName) => {
    const room = await getRoomByName(roomName);
    if(!room) {
        throw new Error('Room not found')
    }
    const messages = await getMessages(room._id, 1)

    return {
        room: room.name,
        messages: messages
    }
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
    updateRoomById,
    getRoomAndMessages
}