const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, 'User name must be provided'],
    },
    email: {
        type: String,
        required: [true, 'Email must be provided'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minlength:6
    },
    activeTokens: [String],

}, {timestamps:true});


UserSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hash) => {
            if (err) return (err);

            this.password = hash;
            next();
        })
    }
})

UserSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('password is missing!');

    try {
        const result = await bcrypt.compare(password, this.password)
        return result;
    } catch (error) {
        console.log('Error while comparing password!', error.message);
    }
}

UserSchema.methods.createJWT = function() {
    return jwt.sign({email:this.email, id:this._id,}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

module.exports = mongoose.model('user', UserSchema)