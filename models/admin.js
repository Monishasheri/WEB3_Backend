const mongoose = require("mongoose");
const AdmindataSchema = new mongoose.Schema({
  from: { type: String },
  to: { type: String },
  balance: { type: String },
  block: { type: String },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Admindata = mongoose.model("Admindata", AdmindataSchema);
module.exports = Admindata;
