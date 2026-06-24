import mongoose from 'mongoose';
import dns from 'node:dns';

// DNS Fix
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URL = "mongodb+srv://kanhaiya:iw32toqGVFcYOtfA@cluster0.i7pck.mongodb.net/SNAPCART";

async function main() {
  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB");

  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  // Find user
  const user = await User.findOne({ email: "kanhaiyajee804418@gmail.com" });
  if (user) {
    console.log("Current User Data in MongoDB:", {
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    console.log("User not found in MongoDB!");
  }

  await mongoose.disconnect();
}

main().catch(console.error);
