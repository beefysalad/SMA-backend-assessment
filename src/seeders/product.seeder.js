const prisma = require("../utils/prisma");
const { faker } = require("@faker-js/faker");
const { buildProducts } = require("./product.factory");

const TOTAL = 50000;
const BATCH_SIZE = 1000;
const LOG_EVERY = 5000;

async function seed() {
  console.log(`Seeding ${TOTAL} products...`);

  let created = 0;
  while (created < TOTAL) {
    const remaining = TOTAL - created;
    const size = Math.min(BATCH_SIZE, remaining);

    const data = buildProducts(size, faker);

    await prisma.product.createMany({ data });

    created += size;
    if (created % LOG_EVERY === 0 || created === TOTAL) {
      console.log(`Inserted ${created}/${TOTAL} products`);
    }
  }

  console.log("Seeding complete.");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
