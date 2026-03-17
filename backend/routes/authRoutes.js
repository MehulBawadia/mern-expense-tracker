const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-info", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(422).json({
      status: "failed",
      message: "No image file uploaded.",
      data: [],
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  return res.status(200).json({
    status: "success",
    message: "Image uploaded",
    data: {
      url: imageUrl,
    },
  });
});

module.exports = router;
