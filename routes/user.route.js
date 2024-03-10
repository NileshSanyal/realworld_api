const userController = require('../controllers/user.controller');
const { isAuthenticatedUser } = require('../middlewares/auth.middleware');
const validateSchema = require('../middlewares/validate-schema');
const registerValidationSchema = require('../validation-schemas/register-validation.schema');
const loginValidationSchema = require('../validation-schemas/login-validation.schema');

module.exports = function (app) {
  app.get('/api/user', isAuthenticatedUser, userController.currentUser);
  app.put('/api/user', isAuthenticatedUser, userController.updateUser);
  app.post(
    '/api/users',
    validateSchema(registerValidationSchema),
    userController.registerUser
  );
  app.post(
    '/api/users/login',
    validateSchema(loginValidationSchema),
    userController.loginUser
  );
  app.get('/api/profiles/:username', userController.userProfile);
  app.post(
    '/api/profiles/:username/follow',
    isAuthenticatedUser,
    userController.followUser
  );
  app.delete(
    '/api/profiles/:username/follow',
    isAuthenticatedUser,
    userController.unFollowUser
  );
};
