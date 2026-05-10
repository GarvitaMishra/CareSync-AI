const router = require("express").Router();
const { createOrder } = require("../controllers/paymentController");
const { verifyPayment } = require("../controllers/paymentController");


router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;