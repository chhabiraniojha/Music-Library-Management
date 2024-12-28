const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const userController = require('../controllers/userController');

// Route to fetch all users (Admin only)
router.get('/', authenticate, userController.getAllUsers);

// Route to add a new user (Admin only)
router.post('/add-user', authenticate, userController.addUser);

// Route to delete a user by ID (Admin only)
router.delete('/:id', authenticate, userController.deleteUser);

// // Route to update user password (Authenticated users only)
router.put('/update-password', authenticate, userController.updatePassword);

module.exports = router;
