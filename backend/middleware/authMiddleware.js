const { User } = require('../models');

const protect = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      req.user = await User.findByPk(req.session.userId, { 
        attributes: { exclude: ['password'] } 
      });
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      return next();
    } catch (error) {
      console.error('Session Protection Error:', error);
      return res.status(401).json({ message: 'Not authorized, database error' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no active session' });
};

module.exports = { protect };
