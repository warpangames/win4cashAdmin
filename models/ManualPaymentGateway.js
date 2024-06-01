const mongoose = require("mongoose");
// Define the Mongoose schema
const ImgCollectionPayemnt = new mongoose.Schema({
  Sliderimages: [
    {
      UpiName: {
        type: String
      },
      PaymentGateway: {
        type: Buffer
      }
    }
  ]
});
// Create the Mongoose model
const ManualCollectData = mongoose.model(
  "ManualCollectData",
  ImgCollectionPayemnt
);

module.exports = { ManualCollectData };
