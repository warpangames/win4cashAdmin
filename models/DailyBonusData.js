const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const DailyBonusSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false } // Corrected field name from 'clamed' to 'claimed'
});

const UserDailyBonusSchema = new mongoose.Schema({
  // Define other fields in your user schema here

  // Embed the DailyBonusSchema within the UserSchema
  DailyBonus: {
    type: [DailyBonusSchema],
    default: [
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false },
      { value: 0, status: false, claimed: false }
    ]
  }
});

// Compile the schema into a model
const UserDailyBonusData = mongoose.model(
  "UserDailyBonusData",
  UserDailyBonusSchema
);

module.exports = UserDailyBonusData;
