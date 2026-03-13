const userService = require("../service/user.services");

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
      return res.status(200).json({
        message: "Successfully logged in",
        user,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
