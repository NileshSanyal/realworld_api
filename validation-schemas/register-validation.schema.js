const yup = require('yup')
/**
 * @description The schema to check against when user tries to register
 */
module.exports = yup.object().shape({
  user: yup.object().shape({
    username: yup.string().required('Username is a required field'),
    email: yup
      .string()
      .required('Email is a required field')
      .email('Invalid email address'),
    password: yup.string().required('Password is a required field'),
  }),
})
