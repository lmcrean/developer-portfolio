// Add any global test setup here
// For example, if using testing-library:
import '@testing-library/jest-dom';

// TypeScript declarations for global test environment
declare global {
  namespace NodeJS {
    interface Global {
      jest: any;
      describe: any;
      it: any;
      test: any;
      expect: any;
      beforeEach: any;
      beforeAll: any;
      afterEach: any;
      afterAll: any;
    }
  }
}

export {}; 