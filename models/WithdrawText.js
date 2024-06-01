const mongoose = require("mongoose");

const WithdrawText = new mongoose.Schema({
  FixedAmount: { type: Number, default: 0 }
});
const WithdrawTextData = mongoose.model("WithdrawTextData", WithdrawText);
module.exports = WithdrawTextData;
