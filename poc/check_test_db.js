require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");

// Connect to test database instead of consistpay
const testUri = process.env.MONGO_URI.replace("/consistpay", "/test").replace("/?", "/test?");
console.log("Connecting to:", testUri);

mongoose.connect(testUri)
  .then(async () => {
    console.log("Connected to test DB");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in test database:");
    collections.forEach(c => console.log(`- ${c.name}`));
    
    // Check if there is a User collection and print users
    if (collections.some(c => c.name === "users")) {
      const User = mongoose.connection.model("User", new mongoose.Schema({}, { strict: false }));
      const users = await User.find({});
      console.log(`Found ${users.length} users in test DB:`);
      users.forEach(u => console.log(`Email: ${u.get('email')}, Name: ${u.get('name')}`));
    }
    
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
