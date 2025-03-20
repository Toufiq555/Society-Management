const db = require("../config/db");
const express = require("express");
const router = express.Router();

router.put("/approve-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    // update isApprovedstatus in database
    await db.query("UPDATE member SET isApporved = ? WHERE id = ?", [
      isApproved,
      id,
    ]);

    res.json({
      success: true,
      message: "user approvel status updayed successfully!",
    });
  } catch (error) {
    console.error("Approvel error:", error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
