 const express = require("express");
 const router = express.Router();
 const Admin = require("../MODELS/admin");
 const jwt = require("jsonwebtoken");
 const bcrypt = require("bcryptjs");


 // // LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.json({ success:false, msg:"Admin not found" });
  }

  if (password !== admin.password) {
    return res.json({ success:false, msg:"Wrong password" });
  }

  const token = jwt.sign({ id: admin._id }, "secretkey");

  res.json({ success:true, token });
});


 module.exports = router;

