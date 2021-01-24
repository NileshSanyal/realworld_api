const yup = require('yup')
/**
 * @description The schema to check against when user tries to login
 */
module.exports = yup.object().shape({
  user: yup.object().shape({
    email: yup
      .string()
      .required('Email is a required field')
      .email('Invalid email address'),
    password: yup.string().required('Password is a required field'),
  }),
})
