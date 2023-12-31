const { User } = require('../models/user.models');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { generateToken, decodeToken } = require('../utils/jwt');
const asyncWrap = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

exports.getUsers = asyncWrap(async (req, res, next) => {
    const users = await User.find().populate("toys");
    res.status(200).json(users);
})

exports.getUser = asyncWrap(async (req, res, next) => {
    const token = req.cookies.jwt; // Assuming you're using a library like cookie-parser to parse cookies
    if (!token) return next(new AppError(401, "Please login"));

    const payload = decodeToken(token);
    const id = payload._doc.id;

    const user = await User.findById(id).populate('toys');
    if (!user) return next(new AppError(400, "User not exist"));

    res.status(200).json(user);
});

const userJoiSchema = {
    login: Joi.object().keys({
        password: Joi.string(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid'))
    }),
    register: Joi.object().keys({
        password: Joi.string().max(20).required(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')),
        name: Joi.string().required(),
        role: Joi.string()
    })
}

exports.register = asyncWrap(async (req, res, next) => {
    const body = req.body;
    const validate = userJoiSchema.register.validate(body);
    if (validate.error) return next(new AppError(400, validate.error));

    const user = await checkIfUserExist(body.email);
    if (user) return next(new AppError(401, 'User already exist'));

    const newUser = new User(body);
    await newUser.save();

    res.status(201).json(newUser);
});

const checkIfUserExist = async (email) => {
    const user = await User.findOne({ email: email }).populate('toys');
    return user;
}

exports.login = asyncWrap(async (req, res, next) => {
    const body = req.body;
    const validate = userJoiSchema.login.validate(body);
    if (validate.error) return next(new AppError(400, validate.error));

    const user = await checkIfUserExist(body.email);
    if (!user) return next(new AppError(404, 'User not exist, please register before login'));

    const passwordMatch = await bcrypt.compare(body.password.trim(), user.password);
    if (!passwordMatch) return next(new AppError(400, 'Oops, Incorrect password'));

    //token
    const token = generateToken(user);
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 10,
    });
    res.status(200).json({ message: "Login successful", user });
})

// exports.updateUser = async (req, res, next) => {
//     const { id } = req.params;
//     const updateData = req.body;
//     try {
//         const updatedUser = await User.findByIdAndUpdate(id, updateData);
//         if (!updatedUser) throw Error('User not found')
//         res.status(201).json({ msg: "User updated successfuly", updatedUser });
//     } catch (error) {
//         next(error);
//     }
// }

// exports.deleteUser = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//         const deletedUser = await User.findByIdAndDelete(id);
//         if (!deletedUser) throw Error("User not found");
//         res.status(201).json({ msg: "User deleted successfuly", deletedUser });
//     } catch (error) {
//         next(error);
//     }
// }