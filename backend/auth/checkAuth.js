const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'postapp:g9zGqV9h78gn8WU8:node-angular');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed!'
    });
  }
};
