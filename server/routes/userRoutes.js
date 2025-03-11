const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

router.get("/profile", authenticate, async (req, res) => {
  try {
    const [user] = await db.execute("SELECT * FROM members WHERE id = ?", [
      req.user.id,
    ]);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
