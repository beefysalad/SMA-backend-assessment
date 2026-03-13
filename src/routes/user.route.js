const express = require("express");
const userController = require("../controller/user.controller");
const validate = require("../middlewares/validate.middleware");
const { userSignUpSchema, userSignInSchema } = require("../schemas/user.schema");
const router = express.Router();

router.post("/sign-up", validate(userSignUpSchema), userController.userSignUp);
router.post("/sign-in", validate(userSignInSchema), userController.userSignIn);

module.exports = router;
