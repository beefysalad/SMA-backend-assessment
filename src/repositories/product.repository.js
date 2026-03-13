const prisma = require("../utils/prisma");

const productRepository = {
  findAll: async (page, limit, options = {}) => {
    const skip = (page - 1) * limit;
    const { search, sortBy, sortOrder } = options;
    const orderField = sortBy || "createdAt";
    const orderDirection = sortOrder || "desc";
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [orderField]: orderDirection },
      }),
      prisma.product.count({ where }),
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
