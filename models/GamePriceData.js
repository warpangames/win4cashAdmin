const mongoose = require("mongoose");

const GamePriceAll = new mongoose.Schema({
  gameName: { type: String },
  winerPrice: { type: Number },
  player: { type: Number },
  gamePrice: { type: Number }
});

const GamePriceData = mongoose.model("GamePriceData", GamePriceAll);

module.exports = GamePriceData;
