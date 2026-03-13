const express = require("express");
const userController = require("../controller/user.controller");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  userSignUpSchema,
  userSignInSchema,
  updateProfileSchema,
} = require("../schemas/user.schema");
const router = express.Router();

router.post("/sign-up", validate(userSignUpSchema), userController.userSignUp);
router.post("/sign-in", validate(userSignInSchema), userController.userSignIn);
router.post("/logout", userController.logout);
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateProfile
);

module.exports = router;
