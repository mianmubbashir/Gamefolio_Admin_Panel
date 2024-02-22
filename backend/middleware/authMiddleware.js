const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  console.log("req.header: ", req.headers.authorization);
  // Get the token from the request headers or any other location where it's stored
  const token = req.headers.authorization;

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
      req.token = token;
      req.decodeduid = decoded.id;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!token) {
    return res.status(401).send("Not authorized, no token found");
  }
};

module.exports = authMiddleware;
