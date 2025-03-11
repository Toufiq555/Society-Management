const express = require("express");
const {
  generateAdminOTP,
  verifyAdminOTP,
  generateOTP,
  verifyOTP,
} = require("../controllers/authController");
const router = express.Router();

router.post("/send-otp", generateAdminOTP);
router.post("/verify-otp", verifyAdminOTP);
router.post("/login", generateOTP);
router.post("/verify-otp", verifyOTP);

// ✅ Ensure module is exported correctly
module.exports = router;
