const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// Define the Mongoose schema
const imgSchema = new mongoose.Schema({
  imageURL: {
    type: Buffer,
    required: true
  }
});

// Create the Mongoose
const ImgModel = mongoose.model("Imgnew", imgSchema);
module.exports = ImgModel;
