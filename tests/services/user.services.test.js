const userService = require("../../src/service/user.services");
const prisma = require("../../src/utils/prisma");
const bcrypt = require("bcrypt");
const AppError = require("../../src/utils/app.error");

jest.mock("../../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("User Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userSignUpService", () => {
    it("should successfully sign up a new user", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword123",
      };

      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await userService.userSignUpService(
        "Test User",
        "test@example.com",
        "password123",
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "hashedPassword123",
        },
      });

      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("test@example.com");
    });

    it("should throw an AppError if user already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });

      await expect(
        userService.userSignUpService(
          "Test User",
          "test@example.com",
          "password123",
        ),
      ).rejects.toThrow(AppError);

      await expect(
        userService.userSignUpService(
          "Test User",
          "test@example.com",
          "password123",
        ),
      ).rejects.toThrow("User already exists! Log in instead");
    });
  });

  describe("userSignInService", () => {
    it("should successfully sign in a user with valid credentials", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.userSignInService(
        "test@example.com",
        "password123",
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123",
      );
      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("test@example.com");
    });

    it("should throw an AppError if user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.userSignInService("notfound@example.com", "password123"),
      ).rejects.toThrow(AppError);

      await expect(
        userService.userSignInService("notfound@example.com", "password123"),
      ).rejects.toThrow("Invalid Credentials");
    });

    it("should throw an AppError if passwords do not match", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.userSignInService("test@example.com", "wrongpassword"),
      ).rejects.toThrow(AppError);

      await expect(
        userService.userSignInService("test@example.com", "wrongpassword"),
      ).rejects.toThrow("Invalid Credentials");
    });
  });
});
