const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      if (roles.length && !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};

const authorize = (requiredRoles) => {
  return (req, res, next) => {
    const { role } = req.user; 
    
    if (!requiredRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
    }
    next();
  };
};

module.exports = {auth, authorize};
