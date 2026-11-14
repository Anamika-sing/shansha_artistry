const express = require("express");
const router = express.Router();

const Order = require("./order");
const { protect, adminOnly } = require("./authMiddleware");

// CREATE ORDER (login zaroori)
router.post("/", protect, async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      user: req.user.id, // token se aayi id, frontend par bharosa nahi
    });
    await newOrder.save();

    res.json({ message: "Order Saved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MY ORDERS (sirf logged-in user ke apne orders)
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS (sirf admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PAYMENT STATUS (sirf admin)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["Pending", "Paid", "Cancelled"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;