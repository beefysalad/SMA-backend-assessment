const userController = require("../../src/controller/user.controller");
const userService = require("../../src/service/user.services");
const AppError = require("../../src/utils/app.error");

jest.mock("../../src/service/user.services");

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("User Controller (unit)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userSignUp", () => {
    it("returns 201 with user payload on success", async () => {
      const mockUser = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
      };

      userService.userSignUpService.mockResolvedValue(mockUser);

      const req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = createRes();
      const next = jest.fn();

      await userController.userSignUp(req, res, next);

      expect(userService.userSignUpService).toHaveBeenCalledWith(
        "Test User",
        "test@example.com",
        "password123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Succesfully created user",
        user: mockUser,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next with AppError on failure", async () => {
      const error = new AppError("User already exists! Log in instead", 400);
      userService.userSignUpService.mockRejectedValue(error);

      const req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = createRes();
      const next = jest.fn();

      await userController.userSignUp(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("userSignIn", () => {
    it("returns 200 with user payload on success", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      userService.userSignInService.mockResolvedValue(mockUser);

      const req = {
        body: { email: "test@example.com", password: "password123" },
      };
      const res = createRes();
      const next = jest.fn();

      await userController.userSignIn(req, res, next);

      expect(userService.userSignInService).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully logged in",
        user: mockUser,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next with AppError on failure", async () => {
      const error = new AppError("Invalid Credentials", 401);
      userService.userSignInService.mockRejectedValue(error);

      const req = {
        body: { email: "test@example.com", password: "password123" },
      };
      const res = createRes();
      const next = jest.fn();

      await userController.userSignIn(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
