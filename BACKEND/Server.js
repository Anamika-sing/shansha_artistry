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
  .catch(err => console.log(err));

// ROUTES
const orderRoutes = require("./ROUTES/orderRoutes");
const adminRoutes = require("./ROUTES/adminRoutes");
const productRoutes = require("./ROUTES/productRoutes");
const userRoutes = require("./ROUTES/userRoutes");

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});