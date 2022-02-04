module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['jest', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: ['dist/'],
  rules: {
    'import/no-cycle': 'off',
    'import/no-unresolved': [2, { ignore: ['@'] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
