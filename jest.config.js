export default {
  testEnvironment: "node",
  transform: {}, // Disable transforms as we're using native ES modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
