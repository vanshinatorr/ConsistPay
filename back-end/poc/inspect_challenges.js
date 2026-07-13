const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vanshvijay9784_db_user:consistpay2026@cluster0.bt4ggwo.mongodb.net/consistpay?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB successfully.");
  
  const adminDb = mongoose.connection.client.db().admin();
  const dbs = await adminDb.listDatabases();
  console.log("\nDatabases in Cluster:");
  console.log(dbs.databases.map(db => db.name));
  
  // Try to connect to each relevant db and show collections
  for (const dbInfo of dbs.databases) {
    const dbName = dbInfo.name;
    if (['admin', 'local', 'config'].includes(dbName)) continue;
    
    const db = mongoose.connection.client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`\nDatabase: ${dbName} - Collections:`, collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'challenges')) {
      const challengeDocs = await db.collection('challenges').find({}).toArray();
      console.log(`Found ${challengeDocs.length} challenges inside ${dbName}.challenges`);
      challengeDocs.forEach(ch => {
        console.log(`- ID: ${ch._id}, Invite: ${ch.inviteCode}, Status: ${ch.status}, EndDate: ${ch.endDate}`);
      });
    }
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
