const twilio = require("twilio");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

// ✅ Get Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
console.log(accountSid, authToken, twilioPhone);

// ✅ Initialize Twilio client
const twilioClient = new twilio(accountSid, authToken);

// ✅ Function to send OTP via SMS
const sendOTPPhone = async (phone, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhone,
      to: phone,
    });
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { sendOTPPhone };
