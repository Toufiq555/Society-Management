// routes/advertisementRoutes.js
const express = require("express");
const router = express.Router();

const {
  addAdvertisement,
  getAdvertisements,
  deleteAdvertisement,
} = require("../controllers/AdvertisementController");



router.post("/add-advertisement", addAdvertisement);
router.get("/get-advertisements", getAdvertisements);
router.delete("/advertisements/:id", deleteAdvertisement);

module.exports = router;
