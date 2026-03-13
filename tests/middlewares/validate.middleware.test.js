const validate = require("../../src/middlewares/validate.middleware");
const { userSignUpSchema } = require("../../src/schemas/user.schema");

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("Validate Middleware", () => {
  it("returns 400 with formatted errors when validation fails", () => {
    const req = { body: { name: "Test User", password: "short" } };
    const res = createRes();
    const next = jest.fn();

    validate(userSignUpSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
      ]),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when validation passes", () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    };
    const res = createRes();
    const next = jest.fn();

    validate(userSignUpSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
