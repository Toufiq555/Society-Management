const express = require('express');
const router = express.Router();
const { getAdvertisements, addAdvertisement, deleteAdvertisement } = require('../controllers/AdvertisementController'); // Adjust path

router.get('/get-advertisements', getAdvertisements);
router.post('/add-advertisement', addAdvertisement);
router.delete('/advertisements/:id', deleteAdvertisement);

module.exports = router;