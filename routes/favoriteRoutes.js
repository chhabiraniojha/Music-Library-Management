const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

// get all albums
router.get('/:category',authenticate, favoriteController.getFavoritesByCategory);

// adding favorite tracks albums and artists
router.post('/add-favorite',authenticate, favoriteController.addFavorite);

// delete favorite
router.delete('/remove-favorite/:id',authenticate, favoriteController.removeFavorite);


module.exports = router;