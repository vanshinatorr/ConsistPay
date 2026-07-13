require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/consistpay")
  .then(async () => {
    console.log("Connected to MongoDB");
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log("Databases in cluster:");
    for (let d of dbs.databases) {
      console.log(`- Name: ${d.name}`);
    }
    
    // Check current database collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in current database:");
    collections.forEach(c => console.log(`- ${c.name}`));
    
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
