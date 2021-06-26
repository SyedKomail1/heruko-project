require 
const express = require("express");
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const validateuser = require("../../middlewares/validateuser");

router.post("/register",validateuser, async (req, res) => {
  if(req.body.name =="" && req.body.email =="" && req.body.password ==""  ) return res.status(400).send("Kindly Enter the Name, Email and Password");
  if(req.body.name =="" && req.body.email ==""   ) return res.status(400).send("Kindly Enter the Name and Email");
  if(req.body.email =="" && req.body.password ==""   ) return res.status(400).send("Kindly Enter the Email and Password");
  if(req.body.name =="" && req.body.password ==""   ) return res.status(400).send("Kindly Enter the Name and Password");
  if(req.body.name =="") return res.status(400).send("Kindly Enter the name");
  if(req.body.email =="") return res.status(400).send("Kindly Enter the Email");
  if(req.body.password =="") return res.status(400).send("Kindly Enter the Password");
  //if(req.body.email !="@"  ) return res.status(400).send("Enter a Valid email");

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User();
  
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  await user.generateHashedPassword();
  await user.save();
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  let datatoretuen={
    name: user.name,
    email: user.email,
    token: user.token,

  };
  return res.send(datatoretuen);
});
router.post("/login", async (req, res) => {
  if(req.body.email =="" && req.body.password =="") return res.status(400).send("Kindly Enter the Email and Password");
  if(req.body.email =="") return res.status(400).send("Kindly Enter the Email");
  if(req.body.password =="") return res.status(400).send("Kindly Enter the Password");
  
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  
 
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});
module.exports = router;