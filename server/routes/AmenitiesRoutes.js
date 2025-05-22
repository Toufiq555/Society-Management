// const express = require("express");
// const db = require("../config/db");
// const router = express.Router();

// const {
//   addAmenity,
//   getAmenity,
//   deleteAmenity,
//   bookAmenity ,
// } = require("../controllers/AddAmenityController");

// router.post("/add-amenity", addAmenity);
// router.get("/get-amenity", getAmenity);

// router.delete("/:id", deleteAmenity);
// router.post("/book-amenity", bookAmenity);

// module.exports=router;



// routes/amenities.js
const express = require("express");
const router = express.Router();
const { getAmenity, addAmenity, deleteAmenity, bookAmenity } = require("../controllers/AddAmenityController");

// GET all amenities
router.get('/get-amenity', getAmenity);

// ADD a new amenity (will handle image upload)
router.post('/add-amenity', addAmenity);

// DELETE an amenity by ID
router.delete('/amenities/:id', deleteAmenity);

// GET amenity by name
router.get('/:name', (req, res) => {
  // This route is defined in the controller
  require("../controllers/AddAmenityController").router.handle(req, res, (err) => {
    if (err) {
      console.error('Error handling amenity by name route:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// BOOK an amenity
router.post('/book-amenity', bookAmenity);

module.exports = router;