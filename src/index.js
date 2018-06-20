const { createJestRunner } = require('create-jest-runner');

const runner = createJestRunner(require.resolve('./run'));

module.exports = runner;
