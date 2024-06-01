const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// Define the Joi schema for validation
const festivalBonusJoiSchema = Joi.object({
  festivalbonusdataname: Joi.string().required(),
  festivalBonusdata: Joi.number().required()
});

// Define the Mongoose schema
const festivalBonusSchema = new mongoose.Schema({
  festivalbonusdataname: { type: String, required: true },
  festivalBonusdata: { type: Number, required: true },
  date: { type: Date },
  status: { type: Boolean }
});

// Create a function to validate the data against the Joi schema
const validateFestivalBonus = (data) => {
  return festivalBonusJoiSchema.validate(data);
};

// Create the Mongoose model
const FestivalBonusData = mongoose.model(
  "FestivalBonusData",
  festivalBonusSchema
);

module.exports = {
  FestivalBonusData,
  validateFestivalBonus
};
