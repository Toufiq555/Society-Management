const jwt = require("jsonwebtoken");

module.exports = (req, re, next) => {
  const token = request.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user id ectract karein
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token." });
  }
};
