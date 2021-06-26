const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

//This middle ware i want only that it should access by log in user
async function auth(req, res, next) {
  let token = req.header("x-auth-token"); //checking if token is coming
  if (!token) return res.status(400).send("Token Not Provided");
  try {
    let user = jwt.verify(token, config.get("jwtPrivateKey")); //  user se ye info le rahe { _id: user._id, name: user.name, role: user.role },

    req.user = await User.findById(user._id);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
}
module.exports = auth;