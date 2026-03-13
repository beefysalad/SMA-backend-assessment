const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const errorHandler = require("./middlewares/error.middleware");
const PORT = process.env.PORT || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const authMiddleware = require("./middlewares/auth.middleware");

//middlewares
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

//routes
app.use("/api/auth", userRoute);
app.use("/api/products", authMiddleware, productRoute);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
