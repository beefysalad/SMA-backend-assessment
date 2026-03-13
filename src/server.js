const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const errorHandler = require("./middlewares/error.middleware");
const PORT = process.env.PORT || 8080;
const userRoute = require("./routes/user.route");

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", userRoute);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
