module.exports = {
  extension: ['ts'],
  include: ['src/**/*.ts'],
  exclude: [
    'node_modules/**',
    'test/**',
    'cdk.out/**',
    '**/*.d.ts'
  ],
  reporter: ['text', 'json', 'lcov', 'html'],
  'report-dir': './coverage',
  all: true,
  'check-coverage': true,
  branches: 80,
  lines: 80,
  functions: 80,
  statements: 80
};
