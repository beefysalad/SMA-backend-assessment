const prisma = require("../utils/prisma");

const userRepository = {
  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },

  create: async (data) => {
    return prisma.user.create({ data });
  },
};

module.exports = userRepository;
