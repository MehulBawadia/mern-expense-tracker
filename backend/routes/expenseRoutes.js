const express = require("express");
const { index, store } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, index);
router.post("/create", protect, store);

module.exports = router;
