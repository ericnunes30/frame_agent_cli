module.exports = {
  // Preset for TypeScript support
  preset: 'ts-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Roots where Jest will look for tests and source files
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*\.(test|spec).{js,jsx,ts,tsx}'
  ],
  
  // File extensions to resolve
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  
  // Module name mapping for imports
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@core/(.*)
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  
  // Coverage reporting settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/cli.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Module resolution paths
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Test environment options
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  
  // Clear mocks
  clearMocks: true,
  
  // Reset modules
  resetModules: false,
  
  // Restore mocks
  restoreMocks: true,
};: '<rootDir>/src/core/$1',
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  
  // Coverage reporting settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/cli.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Module resolution paths
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Test environment options
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  
  // Clear mocks
  clearMocks: true,
  
  // Reset modules
  resetModules: false,
  
  // Restore mocks
  restoreMocks: true,
};