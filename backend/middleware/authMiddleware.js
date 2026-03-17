const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized. Invalid token provided.",
      data: [],
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while protecting the route.",
      data: {
        error: error.message,
      },
    });
  }
};
