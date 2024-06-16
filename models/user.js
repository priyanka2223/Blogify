const mongoose = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: "/public/images/User-avatar.svg.webp"
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true })

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified("password")) return 0
    const secret = randomBytes(16).toString();
    const hash = createHmac('sha256', secret).update(user.password).digest('hex');
    this.salt = secret
    this.password = hash
    next();
});

userSchema.static('matchPassword', async function(email, password) {
    const userQuery = await this.findOne({ email })
    if (!userQuery)  throw new Error("Incorrect Email")
    const secret = userQuery.salt
    const hashedPwd = userQuery.password
    const hashPwd = createHmac('sha256', secret).update(password).digest('hex');

    if (hashPwd === hashedPwd) {
        const token = createTokenForUser(userQuery)
        return token
        //return {...userQuery, password: undefined, salt: undefined}
    }
    else {
       throw new Error("Incorrect Password")
    }
});

const User = mongoose.model("user", userSchema)

module.exports = User