const express = require('express');
const trackController = require('../controllers/trackController');
const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();

// get all tracks
router.get('/', authenticate, trackController.getTracks);

// get track by their id
router.get('/:id', authenticate, trackController.getTrackbyId);

//add artist
router.post('/add-track',authenticate,trackController.addTrack)

// update artist like name,hidden field

// router.put('/:id',authenticate, artistController.updateArtist)

//delete track by their organisations admin and editor only
router.delete('/:id',authenticate,trackController.deleteTrack)



module.exports = router;