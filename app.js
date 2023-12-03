const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRouter = require('./routes/user.routes');
const toyRouter = require('./routes/toy.routes');
const path = require('path');
const globalErrorHandler = require('./utils/errorHandler');
const AppError = require('./utils/AppError');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use('/users', userRouter);
app.use('/domain/toys', toyRouter);



app.all('*', (req, res, next) => {
    return next(new AppError(404, "This requested resource not exist on this server"));
});
app.use(globalErrorHandler);

module.exports = app;