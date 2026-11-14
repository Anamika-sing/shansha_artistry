require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB error:", err.message));

// ROUTES
const orderRoutes = require("./orderRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes"); 
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes); // Add this line to use paymentRoutes 
// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});