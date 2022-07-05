export default {
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!date-fns-tz/)'],
};
