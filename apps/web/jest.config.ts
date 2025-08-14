import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@shared/(.*)$': '<rootDir>/../../shared/$1',
    '^@site/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/.cache/', 
    '/build/',
    '/tests-e2e/'  // Exclude Playwright E2E tests directory
  ],
};

export default config; 