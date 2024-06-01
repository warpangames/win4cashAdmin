const mongoose = require("mongoose");

const ReferWin = new mongoose.Schema({
  FixedAmount: { type: Number, default: 0 }
});
const FixedAmountData = mongoose.model("FixedAmountData", ReferWin);
module.exports = FixedAmountData;
