const { verifyJwtToken } = require('../helpers/jwt.helper');

const isAuthenticatedUser = function (req, res, next) {
  try {
    if (!req?.headers?.authorization?.startsWith('Bearer')) {
      return res.status(401).json({
        error: 'Authentication Failed',
      });
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Authentication Failed',
      });
    }

    const decodedData = verifyJwtToken(token);
    req.user = decodedData;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Authentication Failed',
    });
  }
};
module.exports = { isAuthenticatedUser };
