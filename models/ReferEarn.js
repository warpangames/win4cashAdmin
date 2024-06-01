const mongoose = require("mongoose");

const ReferEarn = new mongoose.Schema({
  child: { type: Number, default: 0 },
  firstParent: { type: Number, default: 0 },
  SecondParent: { type: Number, default: 0 },
  ThirdParent: { type: Number, default: 0 }
});

const ReferEarnData = mongoose.model("ReferEarnData", ReferEarn);

module.exports = ReferEarnData;
