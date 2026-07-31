require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");

// ⚠️ EDIT THIS before running — choose your own password
const NEW_EMAIL = "towhid1501@gmail.com";
const NEW_PASSWORD = "CHANGE_ME_TO_YOUR_OWN_PASSWORD";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  let superAdmin = await User.findOne({ role: "superAdmin" });

  if (!superAdmin) {
    console.log("No existing superAdmin found. Creating a new one...");
    superAdmin = new User({
      name: "Super Admin",
      email: NEW_EMAIL,
      password: NEW_PASSWORD,
      role: "superAdmin",
      emailVerified: true,
      status: "active",
    });
  } else {
    console.log(`Found existing superAdmin: ${superAdmin.email}`);
    superAdmin.email = NEW_EMAIL;
    superAdmin.password = NEW_PASSWORD; // pre-save hook will hash this
    superAdmin.emailVerified = true;
    superAdmin.status = "active";
  }

  await superAdmin.save();
  console.log(`✅ SuperAdmin ready — email: ${superAdmin.email}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});