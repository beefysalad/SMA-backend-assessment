const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const errorHandler = require("./middlewares/error.middleware");
const PORT = process.env.PORT || 8080;

const userRoute = require("./routes/user.route");
console.clear();

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", userRoute);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
