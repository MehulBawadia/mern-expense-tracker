const express = require("express");
const { store } = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, store);

module.exports = router;
