const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  size: String,
  thickness: String,
  base: String,
  medium: String,
});

module.exports = mongoose.model("Product", productSchema);