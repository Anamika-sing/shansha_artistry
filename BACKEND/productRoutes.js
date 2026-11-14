const express = require("express");
const router = express.Router();
const Product = require("./product");
const { protect, adminOnly } = require("./authMiddleware");

// ADD PRODUCT (sirf admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Product save error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET PRODUCTS (sabke liye)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Could not fetch products" });
  }
});

// DELETE PRODUCT (sirf admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Product delete failed" });
  }
});

module.exports = router;