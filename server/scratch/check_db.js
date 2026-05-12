import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb://Niranjan:Niru2026@ac-uswphgx-shard-00-00.lzrsicj.mongodb.net:27017,ac-uswphgx-shard-00-01.lzrsicj.mongodb.net:27017,ac-uswphgx-shard-00-02.lzrsicj.mongodb.net:27017/FarmDirectDB's?ssl=true&replicaSet=atlas-9zitbg-shard-0&authSource=admin&appName=Cluster0";

async function checkDB() {
  try {
    console.log('Connecting to:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const coll of collections) {
      if (coll.name === 'users' || coll.name === 'Farmer') {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`Collection [${coll.name}] count: ${count}`);
        
        if (count > 0) {
            const users = await db.collection(coll.name).find({}).limit(5).toArray();
            console.log(`Recent users in [${coll.name}]:`, users.map(u => ({ name: u.name, email: u.email })));
            
            const nirav = await db.collection(coll.name).findOne({ name: /Nirav/i });
            if (nirav) {
                console.log(`FOUND Nirav in [${coll.name}]:`, nirav);
            }
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDB();
