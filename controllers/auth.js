const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const user = await User.create(req.body);

    const token = user.createJWT();
    res.status(201).json({ success: true, user: user, token: token });
}


const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }


    const user = await User.findOne({ email: email });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const isPaswordCorrect = await user.comparePassword(password)
    if (!isPaswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT();
    res.status(201).json({ token: token })
}

module.exports = { registerUser, login }