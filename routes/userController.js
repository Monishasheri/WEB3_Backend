const express = require("express");
const router = express.Router();
const { Web3 } = require("web3");
const WalletData = require("../models/user");
const Admindata = require("../models/admin");
const web3 = new Web3(
  "https://sepolia.infura.io/v3/d1711e1923534fc6812c0b303a519d1d"
);
const ADMIN_ADDRESS = "0x3B6E6168c0335261c6e1A006323B7667AfBddc7b";
router.get("/admin-address", async (req, res) => {
  res.status(200).json({ adminAddress: ADMIN_ADDRESS });
});
router.post("/store-data", async (req, res) => {
  const { from, amount, dollar, txHash, balance } = req.body;
  try {
    const newData = new WalletData({
      from,
      amount,
      to: ADMIN_ADDRESS,
      dollar,
      txHash,
      balance,
    });
    let admindata = {};
    admindata = await verifyAdminData(ADMIN_ADDRESS);
    console.log(admindata);
    // const newadmindata = new Admindata({
    //   balance: admindata.balanceEth,
    // });
    // await newadmindata.save();
    await newData.save();

    res.status(200).json({
      status: true,
      message: "Sent successfully",
      data: admindata,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(400).json({ status: false, error: "Failed to send data" });
  }
});
async function verifyAdminData(adminAddress) {
  try {
    const balanceWei = await web3.eth.getBalance(adminAddress);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    return {
      address: adminAddress,
      balanceEth: balanceEth,
    };
  } catch (error) {
    console.log("Error fetching admin balance:", error);
    return {
      status: false,
      error: "Failed to fetch admin balance",
    };
  }
}

module.exports = router;
