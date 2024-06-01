const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const BankDetailSehma = new mongoose.Schema({
  UniqeId: {
    type: String,
    required: true
  },
  AccountNumber: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => Joi.number().validate(value).error === undefined,
      message: "Invalid AccounstNumber, must be a number"
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
  IFSC: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().validate(value).error === undefined,
      message: "Invalid IFSC, must be a string"
    }
  },
  BankName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        Joi.string().email().validate(value).error === undefined,
      message: "Invalid Email"
    }
  }
});

const BankDetail = mongoose.model("BankDetailData", BankDetailSehma);

module.exports = BankDetail;
