const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl)
    .then(() => {
        console.log(`Connected to DB: ${mongoUrl}`);
    })
    .catch(error => {
        console.log("Error in connect to DB");
        console.log(error);
    })

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
})