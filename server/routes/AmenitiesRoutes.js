const express = require("express");
const db = require("../config/db");
const router = express.Router();

const {
  addAmenity,
  getAmenity,
  deleteAmenity,
  bookAmenity ,
} = require("../controllers/AddAmenityController");

router.post("/add-amenity", addAmenity);
router.get("/get-amenity", getAmenity);
router.delete("/:id", deleteAmenity);
router.post("/book-amenity", bookAmenity);

module.exports=router;
