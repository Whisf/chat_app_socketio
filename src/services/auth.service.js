const httpStatus = require('http-status');
const { createUser, getUserByName, getUserById } = require('./users.service');
const { generateAuthToken, verifyToken } = require('./token.service')

/**
 * 
 * @param {String} userName 
 * @param {String} password 
 * @returns {Object}
 */
const register = async(userName, password) => {
    console.log("🚀 ~ file: auth.service.js ~ line 12 ~ register ~ userName", userName)
    const user = await createUser(userName, password)
    const tokens = await generateAuthToken(user._id.toString())
    console.log("🚀 ~ file: auth.service.js ~ line 14 ~ register ~ tokens", tokens)
    user.refreshToken = tokens.refresh.token
    console.log(user);
    await user.save()

    return user
}

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (userName, password) => {
  console.log("🚀 ~ file: auth.service.js ~ line 29 ~ loginUserWithEmailAndPassword ~ password", password)
  const user = await getUserByName(userName);
  console.log("🚀 ~ file: auth.service.js ~ line 31 ~ loginUserWithEmailAndPassword ~ userName", userName)
  console.log("🚀 ~ file: auth.service.js ~ line 31 ~ loginUserWithEmailAndPassword ~ user", user)
  const isMatch = await user.comparePassword(password, user);
  console.log("🚀 ~ file: auth.service.js ~ line 32 ~ loginUserWithEmailAndPassword ~ isMatch", isMatch)

  if (!user || isMatch === false) {
    throw new Error(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {Object} user
 * @returns {Promise}
 */
const logout = async (user) => {
  const refreshTokenDoc = await Token.findOne({ where: { id: user.id } });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  refreshTokenDoc.refreshToken = null;
  await refreshTokenDoc.save();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken);
    const tokens = await generateAuthToken(refreshTokenDoc._id.toString());

    refreshTokenDoc.refreshToken = tokens.refresh.token

    await refreshTokenDoc.save()

    return tokens
  } catch (error) {
    console.log(error);
    throw new Error(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  register,
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
};
