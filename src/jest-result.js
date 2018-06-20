export const jestResult = output => ({
  console: null,
  failureMessage: [].concat(output.tests)
    .filter(test => test)
    .filter(test => test.failureMessages && test.failureMessages.length)
    .map(test => test.failureMessages.join('\n'))
    .join('\n'),
  numFailingTests: output.failures || 0,
  numPassingTests: output.passes || 0,
  numPendingTests: output.pendings || 0,
  perfStats: {
    start: output.start,
    end: output.end,
  },
  skipped: output.skipped || undefined,
  snapshot: {
    added: 0,
    fileDeleted: false,
    matched: 0,
    unchecked: 0,
    unmatched: 0,
    updated: 0,
  },
  sourceMaps: {},
  testExecError: output.testExecError || null,
  testFilePath: output.path,
  testResults: output.tests || [],
});

export const jestError = result => jestResult({
  tests: [{
    failureMessages: [result.error],
    status: 'failed',
  }],
  testExecError: result.error,
  ...result,
});
