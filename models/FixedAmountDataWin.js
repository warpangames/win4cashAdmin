const mongoose = require("mongoose");

const ReferWindata = new mongoose.Schema({
  FixedAmount: { type: Number, default: 0 }
});
const FixedAmountDataOfWin = mongoose.model(
  "FixedAmountDataOfWin",
  ReferWindata
);
module.exports = FixedAmountDataOfWin;
