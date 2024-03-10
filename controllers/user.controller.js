const {
  saveUser,
  loginUser,
  currentUser,
  updateUser,
  userProfile,
  followUser,
  unFollowUser,
} = require('../services/user.service');

exports.registerUser = async (req, res, next) => {
  return saveUser(req.body.user)
    .then((user) => {
      if (user) {
        return res.status(200).json({ message: 'User registered successfully' });
      }
    })
    .catch(next);
};

exports.loginUser = async (req, res, next) => {
  return loginUser(req.body.user)
    .then((userData) => {
      if (userData) {
        return res.status(200).json({ user: userData });
      }
    })
    .catch(next);
};

exports.currentUser = async (req, res, next) => {
  return currentUser(req.user._id)
    .then((currentUserData) => {
      if (currentUserData) {
        return res.status(200).json({ user: currentUserData });
      }
    })
    .catch(next);
};

exports.updateUser = async (req, res, next) => {
  return updateUser(req.user._id, req.body.user)
    .then((updatedUserData) => {
      if (updatedUserData) {
        return res.status(200).json({ user: updatedUserData });
      }
    })
    .catch(next);
};

exports.userProfile = async (req, res, next) => {
  const userName = req.params.username;
  if (userName) {
    return userProfile(userName)
      .then((userProfileData) => {
        return res.status(200).json({ profile: userProfileData });
      })
      .catch(next);
  }
};

exports.followUser = async (req, res, next) => {
  return followUser(req.params.username, req.user._id)
    .then((follow) => {
      return res.status(200).json({ profile: follow });
    })
    .catch(next);
};

exports.unFollowUser = async (req, res, next) => {
  return unFollowUser(req.params.username, req.user._id)
    .then((unfollow) => {
      return res.status(200).json({ profile: unfollow });
    })
    .catch(next);
};
