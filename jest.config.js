/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
    // 是否显示覆盖率报告
  collectCoverage: true,
  reporters: ['default',
    ['jest-html-reporters', {
      publicPath: 'coverage',
      filename: 'reporter.html',
      expand: true,
    }]],
};