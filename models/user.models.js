const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "The value must be either 'admin','user','premium'",
        },
        default: "user",
    },
    toys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Toy"
        },
    ]
},
    { versionKey: false },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })

userSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;