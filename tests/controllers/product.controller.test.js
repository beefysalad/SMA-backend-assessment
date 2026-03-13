const productController = require("../../src/controller/product.controller");
const productService = require("../../src/service/product.services");
const AppError = require("../../src/utils/app.error");

jest.mock("../../src/service/product.services");
jest.mock("@faker-js/faker", () => ({ faker: {} }));

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("Product Controller (unit)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("returns 201 with product payload on success", async () => {
      const mockProduct = { id: 1, name: "Test", price: 10 };
      productService.createProduct.mockResolvedValue(mockProduct);

      const req = { body: { name: "Test", price: 10 } };
      const res = createRes();
      const next = jest.fn();

      await productController.createProduct(req, res, next);

      expect(productService.createProduct).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next with AppError on failure", async () => {
      const error = new AppError("Validation failed", 400);
      productService.createProduct.mockRejectedValue(error);

      const req = { body: { name: "", price: -1 } };
      const res = createRes();
      const next = jest.fn();

      await productController.createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllProducts", () => {
    it("returns 200 with paginated payload and parsed params", async () => {
      const result = {
        data: [{ id: 1, name: "Test", price: 10 }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      productService.getAllProducts.mockResolvedValue(result);

      const req = {
        query: {
          page: "1",
          limit: "10",
          search: "test",
          sortBy: "price",
          sortOrder: "asc",
        },
      };
      const res = createRes();
      const next = jest.fn();

      await productController.getAllProducts(req, res, next);

      expect(productService.getAllProducts).toHaveBeenCalledWith(1, 10, {
        search: "test",
        sortBy: "price",
        sortOrder: "asc",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("returns 200 with product payload on success", async () => {
      const mockProduct = { id: 2, name: "Test", price: 25 };
      productService.getProductById.mockResolvedValue(mockProduct);

      const req = { params: { id: "2" } };
      const res = createRes();
      const next = jest.fn();

      await productController.getProductById(req, res, next);

      expect(productService.getProductById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("updateProduct", () => {
    it("returns 200 with updated product payload on success", async () => {
      const mockProduct = { id: 3, name: "Updated", price: 50 };
      productService.updateProduct.mockResolvedValue(mockProduct);

      const req = { params: { id: "3" }, body: { name: "Updated" } };
      const res = createRes();
      const next = jest.fn();

      await productController.updateProduct(req, res, next);

      expect(productService.updateProduct).toHaveBeenCalledWith(3, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    it("returns 200 with success message on delete", async () => {
      const mockResult = { message: "Product deleted" };
      productService.deleteProduct.mockResolvedValue(mockResult);

      const req = { params: { id: "4" } };
      const res = createRes();
      const next = jest.fn();

      await productController.deleteProduct(req, res, next);

      expect(productService.deleteProduct).toHaveBeenCalledWith(4);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe("seedProducts", () => {
    it("returns 200 with seed result", async () => {
      const mockResult = { message: "Seeded 100 products." };
      productService.seedProducts.mockResolvedValue(mockResult);

      const req = { body: { count: 100 } };
      const res = createRes();
      const next = jest.fn();

      await productController.seedProducts(req, res, next);

      expect(productService.seedProducts).toHaveBeenCalledWith(
        100,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});
