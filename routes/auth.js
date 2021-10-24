const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    existingUser = await User.findOne({ email:req.body.email });
    if(existingUser){
      return res.status(400).json({ message: "Email already exists" });
    }else{
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { body } = req;
  try {
    if (body.email && body.password) {
      const user = await User.findOne({
        email: body.email,
      });
      if (!user) {
        return res.status(400).json({ message: "Email Does not Exist" });
      }
      if (user.password) {
        match = await bcrypt.compare(body.password, user.password);
        if (match) {
          const token = jwt.sign(
            {
              id: user._id,
              isAdmin : user.isAdmin
            },
            process.env.JWT_SEC
          );
            const {password , ...others} = user._doc
          res.status(200).json({...others,token});
        } else {
          return res.status(400).json({ message: "password invalid" });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password and Email are Required" });
    }
  } catch (err) {
    return next(new Error("server error"));
  }
});

module.exports = router;
