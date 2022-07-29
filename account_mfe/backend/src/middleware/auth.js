const jwt = require('jsonwebtoken');

// Middleware function next is a callback to move on the next piece of middleware
module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({
      status: 401,
      msg: 'No token, authorization denied',
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'mysecrettoken');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      msg: 'Unauthorized - Token is not valid',
    });
  }
};
