const express = require("express");
const db = require("../config/db");

const router = express.Router();

// ✅ Total Members Count Route (ADD THIS)
router.get("/count", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM members");
    return res.status(200).json({ totalMembers: rows[0].total });
  } catch (error) {
    console.error("Error fetching total members:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Members
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM members"); // ✅ Await query
    return res.json({ success: true, members: rows });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Add New Member
router.post("/", (req, res) => {
  console.log("Received Data:", req.body); // Log the data coming from the client

  const { name, role, email, phone, block, flat_no } = req.body;

  // // Log each field individually
  console.log("Name:", name);
  console.log("Role:", role);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("block:", block);
  console.log("Flat No:", flat_no);

  // Check if the required fields are present
  if (!name || !email) {
    return res
      .status(500)
      .json({ success: false, message: "Name and Email are required" });
  }

  console.log(
    "Data to be inserted into DB:",
    name,
    role,
    email,
    phone,
    block,
    flat_no
  );

  db.query(
    "INSERT INTO members (name, role, email, phone, block, flat_no) VALUES (?, ?, ?, ?, ?, ?)",
    [name, role, email, phone, block, flat_no],
    (err, result) => {
      if (err) {
        console.error("Database Insert Error:", err); // Log detailed error if insert fails
        return res.status(500).json({ success: false, error: err.message });
      }

      console.log("Insert Successful. Result:", result);

      res.status(201).json({
        success: true,
        message: "Member added successfully",
        member: {
          id: result.insertId,
          name,
          role,
          email,
          phone,
          block,
          flat_no,
        },
      });
    }
  );
});

// ✅ Update Member Status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE members SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ success: true, message: "Member status updated successfully" });
  } catch (error) {
    console.error("Error updating member status:", error);
    res.status(500).json({ message: "Failed to update member status" });
  }
});

// ✅ Delete Member
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM members WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("Database Delete Error:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Member not found" });
      }
      res.json({ success: true, message: "Member deleted" });
    }
  );
});

module.exports = router;
