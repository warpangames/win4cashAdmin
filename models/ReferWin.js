const mongoose = require("mongoose");

const ReferWin = new mongoose.Schema({
  child: { type: Number, default: 0 },
  firstParent: { type: Number, default: 0 },
  SecondParent: { type: Number, default: 0 },
  ThirdParent: { type: Number, default: 0 },
  status: { type: Boolean, default: 0 }
});

const ReferWinData = mongoose.model("ReferWinData", ReferWin);

module.exports = ReferWinData;
