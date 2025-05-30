module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  maxWorkers: 1,
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|react-native" +
      "|expo" +
      "|@expo" +
      "|expo-router" +
      "|react-navigation" +
      "|@react-navigation" +
      "|@unimodules" +
      "|unimodules" +
      "|sentry-expo" +
      "|native-base" +
      "|react-native-svg" +
      "|@babel/runtime" +
      ")",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleDirectories: ["node_modules", "src"],
};
