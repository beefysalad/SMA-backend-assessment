const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Set it in your .env file.");
}

const signToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET || "dev-secret", {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET || "dev-secret");
};

const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
});

module.exports = {
  signToken,
  verifyToken,
  getAuthCookieOptions,
};
