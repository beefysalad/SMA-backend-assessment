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

const updateProfileSchema = z
  .object({
    name: z.string().min(1).optional(),
    password: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().min(6).optional()
    ),
  })
  .refine((data) => !!data.name || !!data.password, {
    message: "Provide a name or password",
  });

module.exports = {
  userSignUpSchema,
  userSignInSchema,
  updateProfileSchema,
};
