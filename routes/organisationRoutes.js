const express = require('express');
const organisationController = require('../controllers/organisationController');
const router = express.Router();

// add organisation
router.post('/add-organisation',organisationController.addOrganisation);

// get organisation
router.get('/',organisationController.getOrganisations);




module.exports = router;