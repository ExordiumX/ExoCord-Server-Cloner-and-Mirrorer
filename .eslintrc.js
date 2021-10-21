module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-async-promise-executor': 'off',
    'no-console': 'off'
  },
};