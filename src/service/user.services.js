const bcrypt = require("bcrypt");
const AppError = require("../utils/app.error");
const userRepository = require("../repositories/user.repository");

const userService = {
  //user sign up service
  userSignUpService: async (name, email, password) => {
    try {
      const exist = await _userExists(email);
      if (exist) {
        throw new AppError("User already exists! Log in instead", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
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

  updateUserProfile: async (userId, data) => {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const updates = {};
      if (data.name) {
        updates.name = data.name;
      }
      if (data.password) {
        updates.password = await bcrypt.hash(data.password, 10);
      }

      if (Object.keys(updates).length === 0) {
        throw new AppError("No updates provided", 400);
      }

      const updatedUser = await userRepository.update(userId, updates);
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
};

//private functiond in service file
const _userExists = async (email) => {
  return userRepository.findByEmail(email);
};

module.exports = userService;
