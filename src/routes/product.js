const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("/products", productController.get);
router.get("/product?", productController.filter);
router.post("/product", productController.create);
router.put("/product/:product_id", productController.update);
router.delete("/product/:product_id", productController.delete);

module.exports = router;
