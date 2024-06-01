const mongoose = require("mongoose");
const WithdraRejshema = new mongoose.Schema({
  amount: { type: Number },
  userPhone: { type: Number },
  currentDate: { type: Date },
  status: { type: Number }
});

const withdraPostreject = mongoose.model("withdraPostreject", WithdraRejshema);

module.exports = withdraPostreject;
