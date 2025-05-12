const express = require("express");
const db = require("../config/db");

const router = express.Router();

// 🔹 ADD NOTICE (MySQL2 Raw Query)
const addAmenity = async (req, res) => {
  try {
    const { name, description, capacity, price, advance } = req.body;

    if (!name || !description || !capacity || !price || !advance) {
      return res.status(400).json({
        message: "All fields (name, description, capacity, price, advance) are required",
      });
    }

    if (isNaN(capacity) || isNaN(price)) {
      return res.status(400).json({ message: "Capacity and price must be numbers" });
    }

    console.log(
      "Data to be inserted into DB:",
      name,
      description,
      capacity,
      price,
      advance
    );

    // ✅ Insert Query
    const [result] = await db.query(
      "INSERT INTO amenities (name, description, capacity, price, advance) VALUES (?, ?, ?, ?, ?)",
      [name, description, capacity, price, advance]
    );

    if (result.affectedRows === 1) {
      return res.status(201).json({ success: true, message: "Amenity added successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to add Amenity" });
    }
  } catch (error) {
    console.error("Error adding Amenity:", error.message, error.stack);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🔹 GET ALL NOTICES
const getAmenity = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM amenities ORDER BY created_at DESC"
    );
    res.json({ success: true, amenities: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

// delete notice
const deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    // Query execute & result destructure karein
    const [result] = await db.query("DELETE FROM amenities WHERE id = ?", [id]);

    // affectedRows check karein
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Amenity not found" });
    }

    res.json({ success: true, message: "Amenity deleted successfully" });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// routes/amenities.js

router.get('/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const [result] = await db.query('SELECT * FROM amenities WHERE name = ?',[name]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Amenity not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching amenity by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔹 BOOK AMENITY

const bookAmenity = async (req, res) => {
  console.log('Booking request received:', req.body);

  const { name, startDate, endDate, timeSlots, amount } = req.body;

  try {
    const start = new Date(startDate).toISOString().split('T')[0];
    let end = start; // Default: end = start

    // If it is a Full Day booking, then use the provided endDate
    if (timeSlots.includes('Full Day') && endDate) {
      end = new Date(endDate).toISOString().split('T')[0];
    }

    const [fullDayClash] = await db.query(
      `SELECT * FROM booking
       WHERE name = ? 
       AND (
         (startDate BETWEEN ? AND ?) 
         OR (endDate BETWEEN ? AND ?)
       ) 
       AND JSON_CONTAINS(selectedSlots, '["Full Day"]')`,
      [name, start, end, start, end]
    );

    if (fullDayClash.length > 0) {
      return res.status(409).json({ message: 'Amenity already fully booked for selected dates' });
    }

    if (!timeSlots.includes('Full Day')) {
      const [slotClash] = await db.query(
        `SELECT * FROM booking 
         WHERE name = ? 
         AND startDate = ? 
         AND JSON_OVERLAPS(selectedSlots, ?)`,
        [name, start, JSON.stringify(timeSlots)]
      );

      if (slotClash.length > 0) {
        return res.status(409).json({ message: 'Selected time slots are already booked' });
      }
    }

    await db.query(
      `INSERT INTO booking (name, startDate, endDate, selectedSlots, amount) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, start, end, JSON.stringify(timeSlots), amount]
    );

    return res.status(201).json({ message: 'Amenity booked successfully' });

  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// router.post('/book-amenity', async (req, res) => {
//   const { amenityName, bookingType, selectedDate, selectedSlots, startDate, endDate, amount, userName, block, flatNo } = req.body;

//   try {
//     const start = new Date(startDate).toISOString().split('T')[0];
//     const end = new Date(endDate).toISOString().split('T')[0];

//     // Check for Full-Day Clash
//     if (bookingType === "Full Day") {
//       const [fullDayClash] = await db.query(
//         `SELECT * FROM bookings 
//          WHERE amenityName = ? 
//          AND (
//            (startDate BETWEEN ? AND ?) 
//            OR (endDate BETWEEN ? AND ?)
//          )`,
//         [amenityName, start, end, start, end]
//       );

//       if (fullDayClash.length > 0) {
//         return res.status(409).json({ message: 'Amenity already fully booked for selected dates' });
//       }
//     } else {
//       // Hourly Slot Clash Check
//       const [slotClash] = await db.query(
//         `SELECT * FROM bookings 
//          WHERE amenityName = ? 
//          AND startDate = ? 
//          AND JSON_CONTAINS(selectedSlots, ?)`,
//         [amenityName, start, JSON.stringify(selectedSlots)]
//       );

//       if (slotClash.length > 0) {
//         return res.status(409).json({ message: 'Selected time slots are already booked' });
//       }
//     }

//     // Insert Booking into DB
//     await db.query(
//       `INSERT INTO bookings 
//        (amenityName, bookingType, selectedDate, selectedSlots, startDate, endDate, amount, userName, block, flatNo)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         amenityName, 
//         bookingType, 
//         selectedDate, 
//         JSON.stringify(selectedSlots),  // Store selected slots as JSON
//         startDate, 
//         endDate, 
//         amount, 
//         userName, 
//         block, 
//         flatNo
//       ]
//     );

//     return res.status(201).json({ message: 'Amenity booked successfully' });

//   } catch (error) {
//     console.error('Booking error:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });


module.exports = {getAmenity,
                  addAmenity,
                  deleteAmenity,
                  bookAmenity,
                  router,
                };
