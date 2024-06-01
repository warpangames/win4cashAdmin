const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// Define the Joi schema for validation
const MailForAllJoi = Joi.object({
  MailType: Joi.string().required(),
  MailTypetext: Joi.number().required()
});

// Define the Mongoose schema
const MailForAllSchema = new mongoose.Schema({
  MailType: { type: String, required: true },
  MailTypetext: { type: String, required: true },
  date: { type: Date },
  status: { type: Boolean }
});

// Create a function to validate the data against the Joi schema
const validateMailBonus = (data) => {
  return MailForAllJoi.validate(data);
};

// Create the Mongoose model
const MaiBonusDataAll = mongoose.model("MaiBonusDataAll", MailForAllSchema);
module.exports = {
  MaiBonusDataAll,
  validateMailBonus
};
