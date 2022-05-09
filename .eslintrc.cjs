module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'plugin:node/recommended',
  ],
  plugins: ['jest', 'prettier', 'security'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'import/no-cycle': 'off',
    'node/no-missing-import': 'off',
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
        map: [
          ['#db', './src/db'],
          ['#watchers', './src/watchers'],
          ['#solitaire', './src/solitaire'],
        ],
      },
    },
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        jest: true,
        mocha: true,
      },
    },
  ],
};
