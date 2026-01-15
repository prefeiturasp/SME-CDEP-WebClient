import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/tests/mocks/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(@testing-library|react-icons|latinize|antd|rc-picker|dayjs|@babel/runtime)/)'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/tests/**',
    '!src/setupTests.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;
