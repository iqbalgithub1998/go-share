const express = require("express");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//  Login a user and send user object.....
router.post(
  "/",
  [
    check("email", "Please include a email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "No User Exists" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      res.json(user);
    } catch (error) {
      return res.status(400).json({ errors: [{ msg: "server error" }] });
    }
  }
);

module.exports = router;
