const productRepository = require("../repositories/product.repository");
const AppError = require("../utils/app.error");

const productService = {
  createProduct: async (data) => {
    return productRepository.create(data);
  },

  getAllProducts: async (page, limit) => {
    const { data, total } = await productRepository.findAll(page, limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data, total, page, limit, totalPages };
  },

  getProductById: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  },

  updateProduct: async (id, data) => {
    const exists = await productRepository.findById(id);
    if (!exists) {
      throw new AppError("Product not found", 404);
    }
    return productRepository.update(id, data);
  },

  deleteProduct: async (id) => {
    const exists = await productRepository.findById(id);
    if (!exists) {
      throw new AppError("Product not found", 404);
    }
    await productRepository.delete(id);
    return { message: "Product deleted" };
  },
};

module.exports = productService;
