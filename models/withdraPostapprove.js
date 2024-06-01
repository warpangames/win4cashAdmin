const mongoose = require("mongoose");
const WithdraApproveshema = new mongoose.Schema({
  amount: { type: Number },
  userPhone: { type: Number },
  currentDate: { type: Date },
  status: { type: Number }
});

const withdraPostapprove = mongoose.model(
  "withdraPostapprove",
  WithdraApproveshema
);

module.exports = withdraPostapprove;
