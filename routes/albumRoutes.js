const express = require('express');
const albumController = require('../controllers/albumController');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

// get all albums
router.get('/',authenticate, albumController.getAlbums);

// get album by id
router.get('/:id',authenticate, albumController.getAlbumById);

// add album
router.post('/add-album',authenticate, albumController.addAlbum);

// update album
router.put('/:id',authenticate, albumController.updateAlbum);

//delete album
router.delete('/:id',authenticate, albumController.deleteAlbum);





module.exports = router;