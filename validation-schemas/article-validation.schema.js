const yup = require('yup')
/**
 * @description The schema to check against when user tries to create an article
 */
module.exports = yup.object().shape({
  article: yup.object().shape({
    title: yup.string().required('Article title is a required field'),
    description: yup.string().required('Article description is a required field'),
    body: yup.string().required('Article body is a required field'),
  }),
})
