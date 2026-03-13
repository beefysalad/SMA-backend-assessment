const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/app.error");

const authMiddleware = (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
