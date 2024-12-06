module.exports = {

    testEnvironment: 'node',

    roots: ['<rootDir>/src/api/test'],

    transform: {
        '^.+\\.js$': 'babel-jest',
    },

    setupFiles: ['<rootDir>/src/api/test/setup.js'],

    collectCoverage: true,
    collectCoverageFrom: [
        'src/api/**/*.{js}',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov'],

    bail: 1,

    verbose: true,

    globalSetup: '<rootDir>/src/api/test/globalSetup.js',
    globalTeardown: '<rootDir>/src/api/test/globalTeardown.js',

    testTimeout: 10000,
}
