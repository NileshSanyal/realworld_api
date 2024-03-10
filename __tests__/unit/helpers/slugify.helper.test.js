const { slugify } = require("../../../helpers/slugify.helper");
describe("Unit tests for slugify.helper.js file", () => {
  // It should replace spaces with '-' in the given article title
  it('should replace spaces with \'-\' when article title contains spaces', () => {
    const articleTitle = 'This is a test title';
    const expected = 'this-is-a-test-title';
    const result = slugify(articleTitle);
    expect(result).toEqual(expected);
  });
  // It should replace '&' with '-and-' in the given article title
  it('should replace \'&\' with \'-and-\' when article title contains \'&\'', () => {
    const articleTitle = 'This & that';
    const expected = 'this-and-that';
    const result = slugify(articleTitle);
    expect(result).toEqual(expected);
  });
  // It should remove all non-word characters from the given article title
  it('should remove all non-word characters when article title contains special characters', () => {
    const articleTitle = 'This is a @#$% test title!';
    const expected = 'this-is-a-test-title';
    const result = slugify(articleTitle);
    expect(result).toEqual(expected);
  });
  // It should handle empty string as input and return empty string
  it('should return empty string when article title is empty', () => {
    const articleTitle = '';
    const expected = '';
    const result = slugify(articleTitle);
    expect(result).toEqual(expected);
  });
  // It should handle non-string input and return slugified string
  it('should handle non-string input and return slugified string', () => {
    const articleTitle = 12345;
    const expected = '12345';
    const result = slugify(articleTitle);
    expect(result).toEqual(expected);
  });
});