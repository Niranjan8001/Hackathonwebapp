import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb://Niranjan:Niru2026@ac-uswphgx-shard-00-00.lzrsicj.mongodb.net:27017,ac-uswphgx-shard-00-01.lzrsicj.mongodb.net:27017,ac-uswphgx-shard-00-02.lzrsicj.mongodb.net:27017/FarmDirectDB's?ssl=true&replicaSet=atlas-9zitbg-shard-0&authSource=admin&appName=Cluster0";

async function migrate() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Found ${usersCount} users in 'users' collection.`);

    if (usersCount > 0) {
      const users = await db.collection('users').find({}).toArray();
      console.log(`Migrating ${users.length} users to 'Farmer' collection...`);

      for (const user of users) {
        // Check if user already exists in Farmer to avoid duplicates
        const exists = await db.collection('Farmer').findOne({ email: user.email });
        if (!exists) {
          await db.collection('Farmer').insertOne(user);
          console.log(`✅ Migrated: ${user.email}`);
        } else {
          console.log(`ℹ️ Skipped (already exists in Farmer): ${user.email}`);
        }
      }
      
      console.log('Migration complete!');
    } else {
      console.log('No users found in "users" collection to migrate.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
