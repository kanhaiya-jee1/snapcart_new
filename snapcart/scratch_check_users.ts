import mongoose from 'mongoose';

const MONGODB_URL = "mongodb+srv://kanhaiya:iw32toqGVFcYOtfA@cluster0.i7pck.mongodb.net/SNAPCART";

async function main() {
  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB");

  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const users = await User.find({});
  console.log("All Users:");
  for (const u of users) {
    console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Mobile: ${u.mobile}, Role: ${u.role}`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
