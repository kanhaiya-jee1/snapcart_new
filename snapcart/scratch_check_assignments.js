const mongoose = require('mongoose');

const MONGODB_URL = "mongodb://kanhaiya:iw32toqGVFcYOtfA@cluster0-shard-00-00.i7pck.mongodb.net:27017,cluster0-shard-00-01.i7pck.mongodb.net:27017,cluster0-shard-00-02.i7pck.mongodb.net:27017/SNAPCART?ssl=true&authSource=admin";

async function main() {
  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB");

  // Load models dynamically as loose schemas so we can see what is in the DB
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const OrderSchema = new mongoose.Schema({}, { strict: false });
  const Order = mongoose.models.Order || mongoose.model('order', OrderSchema);

  const DeliveryAssignmentSchema = new mongoose.Schema({}, { strict: false });
  const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model('DeliveryAssignment', DeliveryAssignmentSchema);

  const assignments = await DeliveryAssignment.find({});
  console.log(`Found ${assignments.length} assignments:`);
  for (const a of assignments) {
    console.log("Assignment:", JSON.stringify(a, null, 2));
    if (a.order) {
      const o = await Order.findById(a.order);
      console.log("Associated Order:", JSON.stringify(o, null, 2));
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
