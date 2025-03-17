const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Import database connection

// Add a new guest
router.post("/", (req, res) => {
  const { name, mobile, building, flat, vehicle } = req.body;
  console.log("Received Guest Data:", req.body);

  if (!name || !mobile || !building || !flat) {
    console.log("Validation Failed: Missing Fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  // ✅ Add NOW() to store static timestamp
  const query = "INSERT INTO guests (name, mobile, building, flat, vehicle, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  pool.query(query, [name, mobile, building, flat, vehicle], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("Guest Added Successfully. ID:", result.insertId);
    res.status(201).json({ message: "Guest added successfully", guestId: result.insertId });
  });
});

// ✅ Get all guests (GET)
router.get("/", (req, res) => {
  console.log("Fetching All Guests");
  const query = "SELECT * FROM guests";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("Guests Fetched Successfully. Count:", results.length);
    res.status(200).json(results); // Send the fetched guests
  });
});

module.exports = router;
