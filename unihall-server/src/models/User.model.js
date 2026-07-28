const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema(
  {
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    upazila: { type: String, default: "" },
    postcode: { type: String, default: "" },
    details: { type: String, default: "" },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "hallAdmin", "universityAdmin", "superAdmin"],
      default: "student",
    },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" },

    // Student academic info
    studentId: { type: String, default: "" },
    department: { type: String, default: "" },
    batch: { type: String, default: "" },
    session: { type: String, default: "" },
    program: { type: String, default: "" },

    // Personal info
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    dob: { type: Date },
    bloodGroup: { type: String, default: "" },
    religion: { type: String, default: "" },
    nationality: { type: String, default: "Bangladeshi" },
    nationalId: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    // Address
    presentAddress: { type: addressSchema, default: () => ({}) },
    permanentAddress: { type: addressSchema, default: () => ({}) },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    refreshToken: { type: String },

    // ── Email verification ──
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    // ── Password reset ──
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);