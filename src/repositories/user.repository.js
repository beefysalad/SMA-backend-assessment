const prisma = require("../utils/prisma");

const userRepository = {
  findById: async (id) => {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },

  create: async (data) => {
    return prisma.user.create({ data });
  },

  update: async (id, data) => {
    return prisma.user.update({ where: { id }, data });
  },
};

module.exports = userRepository;
