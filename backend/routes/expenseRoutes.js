const express = require("express");
const { index, store, destroy } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, index);
router.post("/create", protect, store);
router.delete("/:id", protect, destroy);

module.exports = router;
