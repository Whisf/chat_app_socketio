const httpStatus = require('http-status')
const response = require('../utils/responseTemp')
const catchAsync = require('../utils/catchAsync')
const { createUser, getUserById } = require('../services/users.service')

const addUser = catchAsync(async(req, res) => {
    const user = await createUser(req.body.userName)
    if(!user) {
        throw new Error(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    res.send(response(httpStatus.CREATED, 'Created user', user))
})

module.exports = {
    addUser
}