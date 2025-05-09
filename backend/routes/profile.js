
// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, pool } = require("../controller/connect.js");
require("dotenv").config();
const { verifyToken } = require("../middleware/auth");



router.put("/avatar", verifyToken, async (req, res) => {
  const { avatar_url } = req.body;
  const userId = req.user.id;

  try {
    await pool
      .request()
      .input("avatar_url", sql.VarChar, avatar_url)
      .input("userId", sql.Int, userId)
      .query("UPDATE users SET avatar_url = @avatar_url WHERE id = @userId");

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update avatar", message: err.message });
  }
});
module.exports = router;