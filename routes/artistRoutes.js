const express = require('express');
const artistController = require('../controllers/artistControler');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

// get all artists
router.get('/', authenticate, artistController.getArtists);

// get artist by their id
router.get('/:id', authenticate, artistController.getArtistById);

//add artist
router.post('/add-artist',authenticate,artistController.addArtist)

// update artist like name,hidden field

router.put('/:id',authenticate, artistController.updateArtist)

//delete artist by their organisations admin and editor only
router.delete('/:id',authenticate,artistController.deleteArtist)



module.exports = router;