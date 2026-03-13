const productRepository = require("../repositories/product.repository");
const AppError = require("../utils/app.error");

const productService = {
  createProduct: async (data) => {
    return productRepository.create(data);
  },

  getAllProducts: async (page, limit, options) => {
    const { data, total } = await productRepository.findAll(
      page,
      limit,
      options
    );
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

  seedProducts: async (count, faker) => {
    const total = Math.max(1, Math.min(count, 5000));
    const batchSize = 500;
    let created = 0;
    const { buildProducts } = require("../seeders/product.factory");

    while (created < total) {
      const size = Math.min(batchSize, total - created);
      const data = buildProducts(size, faker);

      await productRepository.createMany(data);
      created += size;
    }

    return { message: `Seeded ${total} products.` };
  },
};

module.exports = productService;
