const userService = require("../service/user.services");
const { signToken, getAuthCookieOptions } = require("../utils/jwt");

const userController = {
  userSignUp: async (req, res, next) => {
    try {
      const { email, name, password } = req.body;
      const user = await userService.userSignUpService(name, email, password);
      
      return res.status(201).json({
        message: "Succesfully created user",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  userSignIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.userSignInService(email, password);
      const token = signToken(user.id);
      res.cookie("token", token, getAuthCookieOptions());
      return res.status(200).json({
        message: "Successfully logged in",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: (_req, res, next) => {
    try {
      res.clearCookie("token", getAuthCookieOptions());
      return res.status(200).json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
