const jwt = require('jsonwebtoken')
const secret = "Priy@123"

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, secret)
    return token
}

function validateToken(token) {
    console.log("validateToken")
    console.log(token)
    return jwt.verify(token, secret)
}

module.exports = {
    createTokenForUser,
    validateToken
}