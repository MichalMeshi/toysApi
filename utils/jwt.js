const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    try {
        const token = jwt.sign({ ...payload }, '123@@', { expiresIn: '2h' })
        return token;
    } catch (error) {
        next(error);
    }
}

exports.decodeToken = (token) => {
    try {
        const payload = jwt.verify(token, '123@@');
        return payload;
    } catch (error) {
        next(error);
    }
}