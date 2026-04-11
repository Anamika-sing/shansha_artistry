const express = require("express");
const router = express.Router();

const Order = require("../MODELS/Order");

// CREATE ORDER
router.post("/", async (req, res) => {

  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    res.json({ message: "Order Saved ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;