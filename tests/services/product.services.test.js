const productService = require("../../src/service/product.services");
const productRepository = require("../../src/repositories/product.repository");
const AppError = require("../../src/utils/app.error");

jest.mock("../../src/repositories/product.repository", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../../src/seeders/product.factory", () => ({
  buildProducts: jest.fn((size) =>
    Array.from({ length: size }, (_, index) => ({
      name: `Product ${index + 1}`,
      price: 10,
      description: "Seeded",
    }))
  ),
}));

describe("Product Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("creates a product", async () => {
      const payload = { name: "Test", price: 10 };
      const mockProduct = { id: 1, ...payload };
      productRepository.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(payload);

      expect(productRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("getAllProducts", () => {
    it("returns paginated payload with total pages", async () => {
      productRepository.findAll.mockResolvedValue({
        data: [{ id: 1, name: "Test", price: 10 }],
        total: 25,
      });

      const result = await productService.getAllProducts(1, 10, {
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(productRepository.findAll).toHaveBeenCalledWith(1, 10, {
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe("getProductById", () => {
    it("returns product when found", async () => {
      const mockProduct = { id: 2, name: "Test", price: 10 };
      productRepository.findById.mockResolvedValue(mockProduct);

      const result = await productService.getProductById(2);

      expect(productRepository.findById).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockProduct);
    });

    it("throws AppError when not found", async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(productService.getProductById(99)).rejects.toThrow(AppError);
      await expect(productService.getProductById(99)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("updateProduct", () => {
    it("updates product when found", async () => {
      const mockProduct = { id: 3, name: "Updated", price: 20 };
      productRepository.findById.mockResolvedValue({ id: 3 });
      productRepository.update.mockResolvedValue(mockProduct);

      const result = await productService.updateProduct(3, { name: "Updated" });

      expect(productRepository.findById).toHaveBeenCalledWith(3);
      expect(productRepository.update).toHaveBeenCalledWith(3, {
        name: "Updated",
      });
      expect(result).toEqual(mockProduct);
    });

    it("throws AppError when product not found", async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(
        productService.updateProduct(999, { name: "Updated" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteProduct", () => {
    it("deletes product when found", async () => {
      productRepository.findById.mockResolvedValue({ id: 4 });
      productRepository.delete.mockResolvedValue({ id: 4 });

      const result = await productService.deleteProduct(4);

      expect(productRepository.findById).toHaveBeenCalledWith(4);
      expect(productRepository.delete).toHaveBeenCalledWith(4);
      expect(result).toEqual({ message: "Product deleted" });
    });

    it("throws AppError when product not found", async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(productService.deleteProduct(999)).rejects.toThrow(AppError);
    });
  });

  describe("seedProducts", () => {
    it("seeds up to 5000 products in batches", async () => {
      productRepository.createMany.mockResolvedValue({ count: 0 });

      const result = await productService.seedProducts(1200, {});

      expect(productRepository.createMany).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ message: "Seeded 1200 products." });
    });

    it("caps seed count at 5000", async () => {
      productRepository.createMany.mockResolvedValue({ count: 0 });

      const result = await productService.seedProducts(9999, {});

      expect(result).toEqual({ message: "Seeded 5000 products." });
    });
  });
});
