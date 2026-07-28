require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const result = await User.updateMany(
    { emailVerified: { $ne: true } },
    { $set: { emailVerified: true } },
  );

  console.log(`✅ Updated ${result.modifiedCount} existing user(s) to emailVerified: true`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});