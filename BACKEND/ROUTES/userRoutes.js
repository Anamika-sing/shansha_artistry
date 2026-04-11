const express = require("express");
const router = express.Router();
const User = require("../MODELS/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    let user = await User.findOne({ email });
    if (user) return res.json({ msg: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ msg: "Signup successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "User not found" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;