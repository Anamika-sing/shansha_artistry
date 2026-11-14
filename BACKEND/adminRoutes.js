const express = require("express");
const router = express.Router();
const Admin = require("./admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, msg: "Admin not found" });
    }

    let isMatch = false;

    if (admin.password.startsWith("$2")) {
      // password already hashed hai
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      // purana plain password: match hone par hash karke save kar do
      isMatch = password === admin.password;
      if (isMatch) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();
      }
    }

    if (!isMatch) {
      return res.json({ success: false, msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;