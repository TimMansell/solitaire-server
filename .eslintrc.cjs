module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
    'cypress/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
    'plugin:security/recommended',
    'plugin:node/recommended',
  ],
  plugins: ['jest', 'prettier', 'cypress', 'security'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'import/no-cycle': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['#@', './src']],
      },
    },
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
