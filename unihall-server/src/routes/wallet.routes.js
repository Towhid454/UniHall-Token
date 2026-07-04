const express = require("express");
const router = express.Router();
const { getMyWallet, deposit } = require("../controllers/wallet.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);
router.use(restrictTo("student"));

router.get("/me", getMyWallet);
router.post("/deposit", deposit);

module.exports = router;
