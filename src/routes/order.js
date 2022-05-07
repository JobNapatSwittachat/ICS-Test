const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

router.get("/orders?", orderController.getOrder);
router.post("/order", orderController.create);
router.put("/order/:order_id", orderController.completeOrder);
router.delete("/order/:order_id", orderController.delete);

module.exports = router;
