const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;
require("./db/connect.js");
const startAdminTxChecker = require("./cron/adminCron");
startAdminTxChecker();
app.use(cors());
app.use(express.json());

const router = require("./routes/userController.js");
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
