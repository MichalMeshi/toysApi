const mongoose = require('mongoose');

const toySchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        require: false
    },
    price: {
        type: Number,
        required: true
    },
    date_created: {
        type: Date,
        default: new Date()
    },
},
    { versionKey: false },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })

toySchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});

const Toy = mongoose.model('Toy', toySchema);
module.exports.Toy = Toy;