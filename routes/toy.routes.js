const express = require('express');
const router = express.Router();
const toyController = require('../controllers/toyController');
const authMiddlware = require('../middlewares/auth');

router.get('/', toyController.getToys);
router.get('/single/:id', toyController.getToyById);
router.get('/category/:catname', toyController.getToyByCategory);
router.get('/search', toyController.searchToy);
router.get('/prices', toyController.searchToysByPrice);
router.post('/', authMiddlware.auth, toyController.addToy);
router.patch('/:editId', authMiddlware.auth, toyController.editToy);
router.delete('/:delId', authMiddlware.auth, toyController.deleteToy);

module.exports = router;