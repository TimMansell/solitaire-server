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
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': [
      'error',
      {
        allowModules: [
          'timezone-mock',
          'cypress-commands',
          'cypress-wait-until',
        ],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['socket'] },
    ],
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
