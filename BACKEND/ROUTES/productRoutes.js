const express = require("express");
const router = express.Router();
const Product = require("../MODELS/product");

// ADD PRODUCT
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// GET PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;