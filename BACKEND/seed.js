// Ek baar chalao: node seed.js
// shop.html ke 20 products database ke "products" collection mein daal deta hai.
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./product");

const mk = (image, name, price, category, size, thickness) => ({
  image: "IMAGES/" + image,
  name,
  price,
  category,
  size,
  thickness,
  base: "MDF Board",
  medium: "Acrylic colour"
});

const products = [
  mk("wallhanging.jpeg",   "Wall Hanging",   499,  "Medium", "12x20 inches (Rectangle)", "3 mm"),
  mk("wallhanging1.jpeg",  "Wall Hanging",   799,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging2.jpeg",  "Wall Hanging",   799,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging3.jpeg",  "Wall Hanging",   799,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging4.jpeg",  "Wall Hanging",   500,  "Medium", "12 inches/30 cm (circle)", "2.5 mm"),
  mk("wallhanging5.jpeg",  "Wall Hanging",   500,  "Medium", "12 inches/30 cm (circle)", "3 mm"),
  mk("wallhanging6.jpeg",  "Wall Hanging",   899,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging7.jpeg",  "Wall Hanging",   899,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging8.jpeg",  "Wall Hanging",   999,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("wallhanging9.jpeg",  "Wall Hanging",   599,  "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("peacock.jpeg",       "Peacock Design", 1600, "Medium", "12/20 inches (rectangle)", "3 mm"),
  mk("wallhanging10.jpeg", "Wall Hanging",   600,  "Medium", "12 inches/30 cm (circle)", "3 mm"),
  mk("wallhanging11.jpeg", "Wall Hanging",   2100, "Large",  "24 inches/61 cm (circle)", "2.5 mm"),
  mk("wallhanging3.jpeg",  "Wall Hanging",   2100, "Large",  "24 inches/61 cm (circle)", "3 mm"),
  mk("mirrorimage.jpeg",   "Mirror",         599,  "Medium", "12x20 inches (Rectangle)", "3 mm"),
  mk("mirrorimage1.jpeg",  "Mirror",         599,  "Medium", "12x20 inches (Rectangle)", "3 mm"),
  mk("mirrorimage3.jpeg",  "Mirror",         599,  "Small",  "12x12 inches (Rectangle)", "3 mm"),
  mk("candle.jpeg",        "Candle Holder",  599,  "Medium", "12x20 inches (rectangle)", "3 mm"),
  mk("candle1.jpeg",       "Candle Holder",  599,  "Small",  "12x12 inches (rectangle)", "3 mm"),
  mk("candleholder1.jpeg", "Candle Holder",  599,  "Small",  "12x12 inches (Rectangle)", "3 mm")
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log("Products already exist (" + count + "). Seed skiped.");
      return;
    }

    await Product.insertMany(products);
    console.log(products.length + " products added in database.");  
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();