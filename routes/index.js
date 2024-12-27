const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
// const artistRoutes = require('./artistRoutes');
// const albumRoutes = require('./albumRoutes');
// const trackRoutes = require('./trackRoutes');
// const favoriteRoutes = require('./favoriteRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/artists', artistRoutes);
// router.use('/albums', albumRoutes);
// router.use('/tracks', trackRoutes);
// router.use('/favorites', favoriteRoutes);

module.exports = router;
