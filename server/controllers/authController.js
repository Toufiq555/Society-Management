const db = require("../config/db"); // mysql connection
const { sendOTPPhone } = require("../helpers/twilioHelper");
const jwt = require("jsonwebtoken");

const generateAdminOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 5 * 60000); // 5 minutes

  try {
    //delete old otp
    await db.execute("DELETE FROM otps WHERE phone = ?", [phone]);

    //store top in data base
    await db.execute(
      "INSERT INTO otps (phone, otp, expires_at) VALUES (?, ?, ?)",
      [phone, otp, expires_at]
    );

    //send otp using twilio
    const response = await sendOTPPhone(phone, otp);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error generating OTP", error });
  }
};

const verifyAdminOTP = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number and OTP are required" });
  }

  try {
    //get latest otp from database
    const [rows] = await db.execute(
      "SELECT * FROM otps WHERE phone = ?  ORDER BY created_at DESC LIMIT 1",
      [phone]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    const { otp: storeOtp, expires_at } = rows[0];

    // check otp expiry
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // compare otp
    if (otp !== storeOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "failed to verify OTP", error });
  }
};

const generateOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    // Check if user exists in members table
    const [users] = await db.execute("SELECT * FROM members WHERE phone = ?", [
      phone,
    ]);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not exist" });
    }
    const user = users[0];

    // Check if user is approved
    if (user.status !== "Approved") {
      return res
        .status(403)
        .json({ success: false, message: "Member not approved" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60000); // 5 minutes

    //delete old otp
    await db.execute("DELETE FROM otps WHERE phone = ?", [phone]);

    //store top in data base
    await db.execute(
      "INSERT INTO otps (phone, otp, expires_at) VALUES (?, ?, ?)",
      [phone, otp, expires_at]
    );

    //send otp using twilio
    const response = await sendOTPPhone(phone, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error generating OTP", error });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  console.log("✅ Incoming Request:", { phone, otp });

  if (!phone || !otp) {
    console.log("❌ Missing Phone or OTP");
    return res
      .status(400)
      .json({ success: false, message: "Phone number and OTP are required" });
  }

  try {
    //get latest otp from database
    console.log("🔍 Fetching OTP from database...");
    const [rows] = await db.execute(
      "SELECT * FROM otps WHERE phone = ?  ORDER BY created_at DESC LIMIT 1",
      [phone]
    );

    console.log("✅ OTP Query Result:", rows);

    if (rows.length === 0) {
      console.log("❌ OTP Not Found");
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    const { otp: storeOtp, expires_at } = rows[0];

    // check otp expiry
    if (new Date() > new Date(expires_at)) {
      console.log("❌ OTP Expired");
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // compare otp
    if (otp !== storeOtp) {
      console.log("❌ Invalid OTP");
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is correct, generate JWT token
    console.log("🔍 Fetching user from members table...");
    const [users] = await db.execute("SELECT * FROM members WHERE phone = ?", [
      phone,
    ]);

    console.log("✅ User Query Result:", users);

    if (users.length === 0) {
      console.log("❌ User Not Found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = users[0];

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    console.log("✅ OTP Verified Successfully, Token Generated!");

    return res.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res
      .status(500)
      .json({ success: false, message: "failed to verify OTP", error });
  }
};

module.exports = { generateAdminOTP, verifyAdminOTP, generateOTP, verifyOTP };
