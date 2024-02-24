const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers or any other location where it's stored
  const token = req.headers.authorization;
  console.log("token: ", token);

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);
    if (decoded?.id) {
      next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", redirectTo: "/login" });
  }

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Not authorized, no token found",
        redirectTo: "/login",
      });
  }
};

module.exports = authMiddleware;
