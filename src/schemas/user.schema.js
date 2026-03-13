const { z } = require("zod");

//zod schemas

const userSignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  userSignUpSchema,
  userSignInSchema,
};
