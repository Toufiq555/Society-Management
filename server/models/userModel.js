const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add name "],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please add email "],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please add password "],
      min: 6,
      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
