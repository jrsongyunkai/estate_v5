module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    semi: [0],
    indent: 'off',
    'vue/script-indent': [
      'off',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
        ignores: ['ConditionalExpression'],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false,
        'invalid-first-character-of-tag-name': false,
      },
    ],
    'no-tabs': 'off', // 增加此行
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
