const yup = require('yup');
/**
 * @description The schema to check against when user tries to add comment
 * for an article
 */
module.exports = yup.object().shape({
  comment: yup.object().shape({
    body: yup.string().required('Comment body is a required field'),
  }),
});
