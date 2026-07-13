const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vanshvijay9784_db_user:consistpay2026@cluster0.bt4ggwo.mongodb.net/consistpay?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB successfully.");
  
  const Challenge = mongoose.model('Challenge', new mongoose.Schema({
    status: String,
    endDate: Date
  }, { strict: false }));
  
  // Find all active challenges in the 'test' database (or consistpay if there are any)
  // Let's connect to test database as well since the records were there
  const testDb = mongoose.connection.client.db('test');
  const activeChallenges = await testDb.collection('challenges').find({ status: 'active' }).toArray();
  
  console.log(`Found ${activeChallenges.length} active challenges in 'test' database to migrate.`);
  
  for (const ch of activeChallenges) {
    const currentEnd = new Date(ch.endDate);
    
    // Construct new date ending at 23:59:59 in Asia/Kolkata timezone on the same calendar day
    const year = currentEnd.getFullYear();
    const month = currentEnd.getMonth();
    const date = currentEnd.getDate();
    
    const newEndStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}T23:59:59+05:30`;
    const newEndDate = new Date(newEndStr);
    
    await testDb.collection('challenges').updateOne(
      { _id: ch._id },
      { $set: { endDate: newEndDate } }
    );
    
    console.log(`Migrated challenge ${ch.inviteCode}: ${ch.endDate} -> ${newEndDate}`);
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
