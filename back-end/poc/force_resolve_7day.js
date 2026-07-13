const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vanshvijay9784_db_user:consistpay2026@cluster0.bt4ggwo.mongodb.net/consistpay?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB successfully.");
  
  const testDb = mongoose.connection.client.db('test');
  
  // Set endDate of CP-BZSSWX to July 12th, 23:59:59 IST
  const newEndDate = new Date("2026-07-12T23:59:59+05:30");
  
  const result = await testDb.collection('challenges').updateOne(
    { inviteCode: 'CP-BZSSWX', status: 'active' },
    { $set: { endDate: newEndDate } }
  );
  
  if (result.modifiedCount > 0) {
    console.log(`Successfully updated CP-BZSSWX endDate to July 12, 23:59:59 IST (Past date).`);
  } else {
    console.log("No active challenge with invite code CP-BZSSWX found to update.");
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error("Error updating date:", err);
  process.exit(1);
});
