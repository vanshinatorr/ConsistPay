require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/consistpay")
  .then(async () => {
    console.log("Connected to MongoDB");
    const users = await User.find({});
    users.forEach(u => {
      console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Plan: ${u.plan}, Balance: ${u.balance}, ActiveDeposit: ${u.activeDeposit}, GraceCoins: ${u.graceCoins}`);
    });
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
