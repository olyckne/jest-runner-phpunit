import { jestError, jestResult } from '../jest-result';

describe('jestResult', () => {
  it('returns a formatted jest result with default values', () => {
    const result = jestResult({
    });

    expect(result.failureMessage).toBe('');
    expect(result.numFailingTests).toBe(0);
    expect(result.numPassingTests).toBe(0);
    expect(result.numPendingTests).toBe(0);
    expect(result.skipped).toBe(undefined);
    expect(result.testExecError).toBe(null);
    expect(result.testResults).toEqual([]);
  });

  it('returns a formatted jest result', () => {
    const start = +new Date();
    const end = +new Date();
    const tests = [
      {
        ancestorTitles: [],
        duration: 100,
        title: 'Test 1',
        fullName: 'Test::Test 1',
        failureMessages: [],
        status: 'passed',
        numPassingAsserts: 1,
      },
      {
        ancestorTitles: [],
        duration: 100,
        title: 'Test 2',
        fullName: 'Test::Test 2',
        failureMessages: [],
        status: 'passed',
        numPassingAsserts: 1,
      },
      {
        ancestorTitles: [],
        duration: 100,
        title: 'Test 3',
        fullName: 'Test::Test 3',
        failureMessages: ['Failed!'],
        status: 'failed',
        numPassingAsserts: 1,
      },
    ];
    const result = jestResult({
      failures: 1,
      passes: 2,
      start,
      end,
      tests,
    });

    expect(result.perfStats).toEqual({ start, end });
    expect(result.numFailingTests).toBe(1);
    expect(result.numPassingTests).toBe(2);
    expect(result.testResults).toBe(tests);
    expect(result.failureMessage).toBe('Failed!');
    expect(result.testExecError).toBe(null);
  });


  it('returns a error formated result on error', () => {
    const result = jestError({
      error: 'Error!',
    });

    expect(result.failureMessage).toBe('Error!');
    expect(result.testExecError).toBe('Error!');
    expect(result.testResults).toEqual([{
      failureMessages: ['Error!'],
      status: 'failed',
    }]);
  });
});
