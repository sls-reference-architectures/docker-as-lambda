const config = {
  setupFilesAfterEnv: ['jest-extended/all'],
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
};

export default config;
