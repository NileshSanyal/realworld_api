const express = require('express');
const app = express();
const cors = require('cors');
const apiErrorHandler = require('./error/api-error-handler');
require('dotenv').config();
const port = process.env.PORT || 4000;

const { connect } = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connect();
require('./routes/user.route')(app);
require('./routes/article.route')(app);
require('./routes/comment.route')(app);
app.use(apiErrorHandler);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
