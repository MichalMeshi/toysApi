const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddlware = require('../middlewares/auth');

router.get('/', authMiddlware.auth, authMiddlware.restrictTo("admin"), userController.getUsers);
router.get('/getUserInfo', authMiddlware.auth, userController.getUser);
router.post('/', userController.register);
router.post('/login', userController.login);
// router.patch('/:id', auth(), userController.updateUser)
// router.delete('/:id', auth(), userController.deleteUser)

module.exports = router;