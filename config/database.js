const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log('Connected to database successfully!');
    })
    .catch((error) => {
      console.log('Error connecting to mongodb', error.message);
    });
};
module.exports = { connect };
