import baseConfig from './jest.config.js';

const config = {
  ...baseConfig,
  globalSetup: './test/common/jest.e2e.setup',
};

export default config;
