const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const UpiDetailSehma = new mongoose.Schema({
  UniqeId: {
    type: String,
    required: true
  },
  UpiAddress: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().validate(value).error === undefined,
      message: "Invalid UpiAddress"
    }
  },
  UserName: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().validate(value).error === undefined,
      message: "Invalid UserName, must be a string"
    }
  },
  PhoneNumber: {
    type: String, // Changed to String type
    required: true,
    validate: {
      validator: (value) => Joi.string().validate(value).error === undefined,
      message: "Invalid PhoneNumber, must be a string"
    }
  }
});

const UpiDetail = mongoose.model("UpiDetailData", UpiDetailSehma);
module.exports = UpiDetail;
