const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    address: String,
    items: Array,
    total: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending"
    },

    // Razorpay online payment ki ids
    razorpayOrderId: String,
    razorpayPaymentId: String,

    // kis user ne order kiya (token se aati hai)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // createdAt aur updatedAt apne aap
);

module.exports = mongoose.model("Order", orderSchema);