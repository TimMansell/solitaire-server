module.exports = {
  extends: ['plugin:cypress/recommended'],
  plugins: ['cypress'],
  env: {
    mocha: true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    strict: 'off',
    'cypress/no-unnecessary-waiting': 'off',
  },
};
