const prisma = require("../utils/prisma");

const productRepository = {
  findAll: async (page, limit) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    return { data, total };
  },

  findById: async (id) => {
    return prisma.product.findUnique({ where: { id } });
  },

  create: async (data) => {
    return prisma.product.create({ data });
  },

  update: async (id, data) => {
    return prisma.product.update({ where: { id }, data });
  },

  delete: async (id) => {
    return prisma.product.delete({ where: { id } });
  },
};

module.exports = productRepository;
