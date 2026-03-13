const express = require("express");
const productController = require("../controller/product.controller");
const validate = require("../middlewares/validate.middleware");
const {
  productCreateSchema,
  productUpdateSchema,
} = require("../schemas/product.schema");

const router = express.Router();

router.post("/", validate(productCreateSchema), productController.createProduct);
router.post("/seed", productController.seedProducts);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put(
  "/:id",
  validate(productUpdateSchema),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
