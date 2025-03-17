
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Import database connection

// Add a new guest
router.post("/", (req, res) => {
  const { name, mobile, building, flat, vehicle, company } = req.body;

  if (!name || !mobile || !building || !flat) {
    return res.status(400).json({ message: "All fields are required" });
  }

   // ✅ Add NOW() to store static timestamp
   const query = "INSERT INTO Deliveries (name, mobile, building, flat, vehicle, company, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
  pool.query(query, [name, mobile, building, flat, vehicle, company], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.status(201).json({ message: "Delivery added successfully", guestId: result.insertId });
  });
});
// ✅ Get all deliveries (GET)
router.get("/", (req, res) => {
  const query = "SELECT * FROM Deliveries";
  pool.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.status(200).json(results); // Send the fetched deliveries
  });
});
module.exports = router;