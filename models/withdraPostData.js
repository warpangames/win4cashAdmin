const mongoose = require("mongoose");
const Withdrashema = new mongoose.Schema({
  amount: { type: Number },
  userPhone: { type: Number },
  currentDate: { type: Date },
  status: { type: Number }
});

const withdraPostData = mongoose.model("withdraPostData", Withdrashema);

module.exports = withdraPostData;
