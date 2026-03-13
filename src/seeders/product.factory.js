function buildProducts(count, faker) {
  return Array.from({ length: count }).map(() => ({
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 1, max: 9999, dec: 2 })),
    description: faker.commerce.productDescription(),
  }));
}

module.exports = { buildProducts };
