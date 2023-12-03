const { Toy } = require('../models/toy.models');
const Joi = require('joi');
const asyncWrap = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

exports.getToys = asyncWrap(async (req, res, next) => {
    const { page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const toys = await Toy.find()
        .skip(skip)
        .limit(perPage);
    res.status(200).send(toys);
});

exports.getToyById = asyncWrap(async (req, res, next) => {
    const { id } = req.params;

    const toy = await Toy.findById(id);
    if (!toy) throw Error("Toy not exist");
    res.status(200).send(toy);
});

exports.searchToy = asyncWrap(async (req, res, next) => {
    const { s, page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    if (!s) return next(new AppError(400, 'Search query parameter (s) is required'));
    const toys = await Toy.find({
        $or: [
            { name: { $regex: new RegExp(s, 'i') } },
            { info: { $regex: new RegExp(s, 'i') } },
        ],
    })
        .skip(skip)
        .limit(perPage);
    res.status(200).json(toys);
});


exports.searchToysByPrice = asyncWrap(async (req, res, next) => {
    const { min, max, page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    const priceQuery = {};
    if (min) priceQuery.$gte = parseFloat(min);
    if (max) priceQuery.$lte = parseFloat(max);

    const toys = await Toy.find({
        price: priceQuery,
    })
        .limit(perPage)
        .skip(skip);
    res.status(200).json(toys);
});


exports.getToyByCategory = asyncWrap(async (req, res, next) => {
    const { catname } = req.params;
    const { page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const toy = await Toy.findOne({ category: catname })
        .skip(skip)
        .limit(perPage);
    if (!toy) throw Error("Toy not exist");
    res.status(200).send(toy);
});

exports.addToy = asyncWrap(async (req, res, next) => {
    const toy = { ...req.body };
    toy.user = req.user._id;

    const newToy = await Toy.create(toy);
    req.user.toys.push(newToy._id);
    await req.user.save();

    res.status(201).json({
        status: "saccess",
        newToy,
    });
});

exports.editToy = asyncWrap(async (req, res, next) => {
    const { editId } = req.params;
    const updateData = req.body;

    const updatedToy = await Toy.findByIdAndUpdate(editId, updateData);
    if (!updatedToy) throw Error('Toy not found')
    res.status(201).json({ msg: "Toy updated successfuly", updatedToy });
});

exports.deleteToy = asyncWrap(async (req, res, next) => {
    const { delId } = req.params;
    console.log(delId);
    const deletedToy = await Toy.findByIdAndDelete(delId);
    console.log(deletedToy);
    if (!deletedToy) throw new Error("Toy not found");

    const user = req.user;
    user.toys = user.toys.filter(toyId => toyId.toString() !== delId);
    await user.save();

    res.status(200).json({ msg: "Toy deleted successfully", deletedToy });
});