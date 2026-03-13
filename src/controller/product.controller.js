const productService = require("../service/product.services");

const productController = {
  createProduct: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  getAllProducts: async (req, res, next) => {
    try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
      const result = await productService.getAllProducts(page, limit);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await productService.getProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await productService.updateProduct(id, req.body);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await productService.deleteProduct(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
