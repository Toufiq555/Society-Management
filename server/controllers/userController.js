const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");

//login
const loginController = async (req, res) => {
  try {
    const { phone } = req.body;
    //validation
    if (!phone) {
      return res.status(500).send({
        success: false,
        message: "Please Provide phone",
      });
    }
    //find user
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }

    //TOken JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "erroe in login",
      error,
    });
  }
};
module.exports = { registerController, loginController };
