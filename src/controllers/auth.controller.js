const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authServices, tokenServices, userService } = require('../services/index');
const response = require('../utils/responseTemp')

const login = catchAsync(async (req, res) => {
    const { userName, password } = req.body;
    console.log("🚀 ~ file: auth.controller.js ~ line 8 ~ login ~ password", password)
    let user, token
    try {
        user = await authServices.loginUserWithEmailAndPassword(userName, password);
        token = await tokenServices.generateAuthToken(user.id);
        user.refreshToken = token.refresh.token
        await user.save()
    } catch (error) {
        throw new Error(error.message, error.code)
    }

    res.send(response(httpStatus.OK, 'Login Success', {token}));
})

const register = catchAsync(async (req, res) => {
    const {userName, password} = req.body;
    const user = await authServices.register(userName, password)

    res.send(response(httpStatus.OK, 'Account Created', user))
})

const refreshAuth = catchAsync(async (req, res) => {
    const tokens = await authServices.refreshAuth(req.body.refreshToken);

    res.send(response(httpStatus.OK, 'Refresh Token Success', {...tokens}))
})

module.exports = {
    login,
    register,
    refreshAuth
}