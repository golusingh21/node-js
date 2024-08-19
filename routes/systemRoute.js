const express = require('express');
const router = express.Router();
const systemController = require('../controller/systemController');

router.get('/countries', systemController.getCountries);
router.get('/states/:countryId', systemController.getStates);
router.get('/cities/:stateId', systemController.getCities);

module.exports = router;