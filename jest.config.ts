import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(@testing-library|react-icons)/)'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;
