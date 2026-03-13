const userService = require("../../src/service/user.services");
const bcrypt = require("bcrypt");
const AppError = require("../../src/utils/app.error");
const userRepository = require("../../src/repositories/user.repository");

jest.mock("../../src/repositories/user.repository", () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
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

      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.userSignUpService(
        "Test User",
        "test@example.com",
        "password123",
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword123",
      });

      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("test@example.com");
    });

    it("should throw an AppError if user already exists", async () => {
      userRepository.findByEmail.mockResolvedValue({
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

      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.userSignInService(
        "test@example.com",
        "password123",
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123",
      );
      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("test@example.com");
    });

    it("should throw an AppError if user does not exist", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

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

      userRepository.findByEmail.mockResolvedValue(mockUser);
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
