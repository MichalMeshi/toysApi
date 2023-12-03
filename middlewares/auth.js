const { decodeToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const { User } = require('../models/user.models');
const asyncWrap = require('../utils/asyncWrapper');

exports.auth = asyncWrap(async (req, res, next) => {

    if (!req.headers.cookie.startsWith("jwt"))
        return next(new AppError(403, "Please login"));

    const token = req.headers.cookie.split("=")[1];
    if (!token) return next(new AppError(401, "Please login"));

    const payload = decodeToken(token);

    const id = payload._doc.id;
    const user = await User.findById(id);
    if (!user) return next(new AppError(403, "Please login"));
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError(403, "You do not have permission to perform this action"));
        next();
    };
};