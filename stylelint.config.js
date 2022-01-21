module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    'keyframes-name-pattern': null,
    'comment-empty-line-before': 'always',
    'rule-empty-line-before': [
      'always',
      { ignore: ['after-comment', 'inside-block'] },
    ],
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
};
