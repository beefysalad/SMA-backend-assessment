const { z } = require("zod");

const userSignUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

const userSignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

module.exports = {
  userSignUpSchema,
  userSignInSchema,
};
