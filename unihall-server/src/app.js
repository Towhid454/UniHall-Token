const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");

const universityRoutes = require("./routes/university.routes");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const roomRoutes = require("./routes/room.routes");
const diningRoutes = require("./routes/dining.routes");
const walletRoutes = require("./routes/wallet.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const adminRoutes = require("./routes/admin.routes");
const hallFeeRoutes = require("./routes/hallFee.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "UniHall API is running" });
});

app.use("/api/universities", universityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/dining", diningRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", adminRoutes);
app.use("/api", hallFeeRoutes);

app.use(errorMiddleware);

module.exports = app;
