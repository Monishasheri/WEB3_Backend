const cron = require("node-cron");
const axios = require("axios");
const { Web3 } = require("web3");
const mongoose = require("mongoose");
const admindata = require("../models/admin");
const web3 = new Web3(
  "https://sepolia.infura.io/v3/d1711e1923534fc6812c0b303a519d1d"
);
const ADMIN_ADDRESS = "0x3B6E6168c0335261c6e1A006323B7667AfBddc7b";
const ETHERSCAN_API_KEY = "G6I7EPABH1H8F4SYTPAM6HBKH5KDEB63WA";
let latestProcessedBlock = 0;
function startAdminTxChecker() {
  cron.schedule("*/1 * * * *", async () => {
    console.log(" Running admin transaction verification...");

    try {
      const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${ADMIN_ADDRESS}&startblock=${latestProcessedBlock}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await axios.get(url);
      const transactions = response.data.result;

      if (!transactions || transactions.length === 0) {
        console.log(" No new transactions.");
        return;
      }

      for (let tx of transactions) {
        if (tx.to && tx.to.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          const amountInEth = web3.utils.fromWei(tx.value, "ether");
          const existingTx = await admindata.findOne({ txHash: tx.hash });
          if (existingTx) continue;

          const txData = new admindata({
            from: tx.from,
            to: tx.to,
            amount: amountInEth,
            block: tx.blockNumber,
            txHash: tx.hash,
          });
          await txData.save();
          console.log("New admin transaction saved:", {
            from: tx.from,
            to: tx.to,
            amount: amountInEth,
            txHash: tx.hash,
            block: tx.blockNumber,
          });
        }
        latestProcessedBlock = Math.max(
          latestProcessedBlock,
          parseInt(tx.blockNumber)
        );
      }
      console.log(latestProcessedBlock);
    } catch (err) {
      console.error("Error checking admin txs:", err.message);
    }
  });
}
module.exports = startAdminTxChecker;
