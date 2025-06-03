const mongoose = require("mongoose");
const WalletDataSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String },
  amount: { type: String, required: true },
  balance: { type: String },
  dollar: { type: String },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const WalletData = mongoose.model("WalletData", WalletDataSchema);
module.exports = WalletData;
