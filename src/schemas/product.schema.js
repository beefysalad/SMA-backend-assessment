const { z } = require("zod");

const priceSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }
  return value;
}, z.number().positive());

const productCreateSchema = z.object({
  name: z.string().min(1),
  price: priceSchema,
  description: z.string().optional(),
});

const productUpdateSchema = productCreateSchema.partial();

module.exports = {
  productCreateSchema,
  productUpdateSchema,
};
