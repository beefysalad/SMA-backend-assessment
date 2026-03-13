const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const AppError = require("../utils/app.error");

const userService = {
  //user sign up service
  userSignUpService: async (name, email, password) => {
    try {
      const exist = await _userExists(email);
      if (exist) {
        throw new AppError("User already exists! Log in instead", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
  //user sign in service
  userSignInService: async (email, password) => {
    try {
      const user = await _userExists(email);
      if (!user) {
        throw new AppError("Invalid Credentials", 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AppError("Invalid Credentials", 401);
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
};

//private function within service file
const _userExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

module.exports = userService;
