const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const placeRoutes = require("./routes/placeRoutes");
const messageroutes = require("./routes/messageroutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const articleRoutes = require("./routes/ArticleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const suggestionsRoutes = require("./routes/suggestionsRoutes");

const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const upload = require("./utils/upload"); // ✅ هذا فيه إعدادات multer المخصصة

require("dotenv").config();
const nodemailer = require("nodemailer");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const passport = require("passport");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 9527;

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json()); // لتحليل الطلبات التي تحتوي على JSON
// تقديم الملفات من مجلد uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// تقديم الملفات من مجلد public
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});
module.exports = app;

// ✅ Passport
app.use(passport.initialize());

// ✅ ربط قاعدة البيانات
connectDB();

// ✅ استخدام المسارات
app.use("/api/auth", authRoutes);
app.use("/places", placeRoutes);
app.use("/api", messageroutes);
app.use("/api", commentRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api", paymentRoutes);
app.use("/articles", articleRoutes);
app.use("/api/suggestions", suggestionsRoutes);

// ✅ مسار تجريبي للتسجيل
app.post("/api/auth/register", (req, res) => {
  console.log("🔴Received data:", req.body);
  res.status(201).json({ message: "User registered" });
});

// ✅ لوج لكل طلب
app.use((req, res, next) => {
  console.log(`🔹 Received request: ${req.method} ${req.url}`);
  next();
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
