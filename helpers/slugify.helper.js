/**
 *
 * @param {string} articleTitle Title of the article
 * @description It generates slug url from the title of the article
 * @returns {string} slugifiedTitle
 * @summary What it does logically: At first it replace spaces with - then replace & with 'and', remove all non-word characters, replace multiple - with single -, trim - from start of text, trim - from end of text
 */
exports.slugify = (articleTitle) => {
  const slugifiedTitle = articleTitle
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '') /* eslint-disable-line */
    .replace(/\-\-+/g, '-') /* eslint-disable-line */
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  return slugifiedTitle
}
