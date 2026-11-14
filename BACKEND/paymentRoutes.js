const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const Product = require("./product");
const Order = require("./order");
const { protect } = require("./authMiddleware");

const router = express.Router();

console.log("paymentRoutes v2 loaded");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. CREATE ORDER (login zaroori)
// Price frontend se nahi, database se nikalti hai.
router.post("/create-order", protect, async (req, res) => {
  console.log("create-order v2 called");
  try {
    const { name, email, mobile, address, items } = req.body;

    if (!name || !email || !mobile || !address) {
      return res.status(400).json({ message: "Please fill all details" });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ message: "No items to order" });
    }

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const qty = Number(it.quantity) || 1;

      if (
        !mongoose.Types.ObjectId.isValid(it.productId) ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > 10
      ) {
        return res.status(400).json({ message: "Invalid item" });
      }

      const product = await Product.findById(it.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // price number ho ya "₹799" jaisa text, dono se sahi number nikalo
      const price = Number(String(product.price).replace(/[^\d.]/g, ""));
      if (!(price > 0)) {
        return res.status(400).json({ message: "Product ka price sahi nahi hai: " + product.name });
      }

      orderItems.push({ name: product.name, price: price, quantity: qty });
      total += price * qty;
    }

    if (!(total > 0)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    // order pehle Pending ke roop mein save hota hai, payment verify hone par Paid
    await Order.create({
      name: String(name).trim(),
      email: String(email).trim(),
      mobile: String(mobile).trim(),
      address: String(address).trim(),
      items: orderItems,
      total,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      razorpayOrderId: rzpOrder.id,
      user: req.user.id
    });

    res.json({
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Unable to create payment order" });
  }
});

// 2. VERIFY PAYMENT (login zaroori)
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, user: req.user.id },
      { paymentStatus: "Paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Payment verified", orderId: order._id });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;