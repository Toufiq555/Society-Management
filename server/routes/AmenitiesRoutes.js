
const express = require("express");
const router = express.Router();
const { getAmenity, addAmenity, deleteAmenity,getBookedSlots, bookAmenity,  getAmenityByName, getMyBookings } = require("../controllers/AddAmenityController");

// GET all amenities
router.get('/get-amenity', getAmenity);

// ADD a new amenity (will handle image upload)
router.post('/add-amenity', addAmenity);

// DELETE an amenity by ID
router.delete('/amenities/:id', deleteAmenity);

router.get("/booked-slots", getBookedSlots);
router.post('/book-amenity', bookAmenity);
router.get('/my-bookings', getMyBookings);
// GET amenity by name
router.get('/:name', getAmenityByName);



module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { getAmenity, addAmenity, deleteAmenity, getBookedSlots, bookAmenity } = require("../controllers/AddAmenityController");

// // --- IMPORTANT: Define specific routes BEFORE wildcard routes ---

// // GET booked slots for an amenity
// router.get("/booked-slots", getBookedSlots); // ✅ Move this to the top or before :name

// // BOOK an amenity
// router.post('/book-amenity', bookAmenity);

// // GET all amenities
// router.get('/get-amenity', getAmenity);

// // ADD a new amenity (will handle image upload)
// router.post('/add-amenity', addAmenity);

// // DELETE an amenity by ID
// router.delete('/amenities/:id', deleteAmenity);

// // GET amenity by name (This should be the LAST GET route to catch specific names)
// router.get('/:name', (req, res) => {
  
//   console.log(`Attempting to get amenity by name: ${req.params.name}`);
 
// });

// module.exports = router;