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
  saveUser(req.body.user)
    .then((user) => {
      if (user) {
        return res.status(200).json({ message: 'User registered successfully' });
      }
    })
    .catch(next);
};

exports.loginUser = async (req, res, next) => {
  loginUser(req.body.user)
    .then((userData) => {
      if (userData) {
        return res.status(200).json({ user: userData });
      }
    })
    .catch(next);
};

exports.currentUser = async (req, res, next) => {
  currentUser(req.user._id)
    .then((currentUserData) => {
      if (currentUserData) {
        return res.status(200).json({ user: currentUserData });
      }
    })
    .catch(next);
};

exports.updateUser = async (req, res, next) => {
  updateUser(req.user._id, req.body.user)
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
    userProfile(userName)
      .then((userProfileData) => {
        if (userProfileData) {
          return res.status(200).json({ profile: userProfileData });
        } else {
          return res.sendStatus(404);
        }
      })
      .catch(next);
  }
};

exports.followUser = async (req, res, next) => {
  followUser(req.params.username, req.user._id)
    .then((follow) => {
      if (follow) {
        return res.status(200).json({ profile: follow });
      } else {
        return res.sendStatus(404);
      }
    })
    .catch(next);
};

exports.unFollowUser = async (req, res, next) => {
  unFollowUser(req.params.username, req.user._id)
    .then((unfollow) => {
      if (unfollow) {
        return res.status(200).json({ profile: unfollow });
      } else {
        return res.sendStatus(404);
      }
    })
    .catch(next);
};
