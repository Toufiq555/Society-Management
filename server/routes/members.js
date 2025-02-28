const express = require("express");
const db = require("../config/db");

const router = express.Router();

// ✅ Get All Members
router.get("/", (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, members: result });
  });
});

// ✅ Add New Member
router.post("/", (req, res) => {
  console.log("Received Data:", req.body);  // Log the data coming from the client
  
  const { name, role, email, phone, building, flat_no } = req.body;

  // // Log each field individually
   console.log("Name:", name);
   console.log("Role:", role);
   console.log("Email:", email);
   console.log("Phone:", phone);
  console.log("Building:", building);
  console.log("Flat No:", flat_no);

  // Check if the required fields are present
  if (!name || !email) {
    return res.status(500).json({ success: false, message: "Name and Email are required" });
  }

  console.log("Data to be inserted into DB:", name, role, email, phone, building, flat_no);

  db.query(
    "INSERT INTO members (name, role, email, phone, building, flat_no) VALUES (?, ?, ?, ?, ?, ?)",
    [name, role, email, phone, building, flat_no],
    (err, result) => {
      if (err) {
        console.error("Database Insert Error:", err);  // Log detailed error if insert fails
        return res.status(500).json({ success: false, error: err.message });
      }

      console.log("Insert Successful. Result:", result);

      res.status(201).json({
        success: true,
        message: "Member added successfully",
        member: { id: result.insertId, name, role, email, phone, building, flat_no },
      });
    }
  );
});


// ✅ Delete Member
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM members WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Database Delete Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.json({ success: true, message: "Member deleted" });
  });
});

module.exports = router;
