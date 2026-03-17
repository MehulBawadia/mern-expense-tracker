const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(422).json({
      status: "failed",
      message: "Fill in the details.",
      data: [],
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with the provided email address.",
        data: [],
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    return res.status(201).json({
      status: "success",
      message: "User successfully registered.",
      data: {
        id: user._id,
        user: user,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not register user.",
      data: {
        error: err.message,
      },
    });
  }
};
