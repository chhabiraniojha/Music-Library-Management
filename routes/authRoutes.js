const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
