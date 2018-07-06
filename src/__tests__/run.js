import Worker from 'jest-worker';
import run from '../run';

const mockDate = new Date();
global.Date = jest.fn(() => mockDate);
const mockRun = jest.fn();
const mockEnd = jest.fn();
const mockParseResult = jest.fn();
const mockCleanUp = jest.fn();
jest.mock('jest-worker', () => jest.fn().mockImplementation(() => ({
  run: mockRun, parseResult: mockParseResult, end: mockEnd, cleanUp: mockCleanUp,
})));

afterEach(() => {
  mockRun.mockClear();
  mockEnd.mockClear();
  mockCleanUp.mockClear();
  mockParseResult.mockClear();
  Worker.mockClear();
});

describe('Run', () => {
  it('runs', async () => {
    const result = await run({
      config: {
        cacheDirectory: '/tmp',
      },
      testPath: 'tests/ExampleTest.php',
    });

    const outputFile = '/tmp/jest-runner-phpunit-tests-ExampleTest.php.xml';

    expect(Worker).toHaveBeenCalledWith(require.resolve('../phpunit'));

    expect(mockRun).toHaveBeenCalledWith('tests/ExampleTest.php', outputFile);
    expect(mockParseResult).toHaveBeenCalledWith(outputFile);
    expect(mockCleanUp).toHaveBeenCalledWith(outputFile);
    expect(mockEnd).toHaveBeenCalled();

    expect(result.testFilePath).toBe('tests/ExampleTest.php');
    expect(result.perfStats).toEqual({
      start: mockDate.getTime(),
      end: mockDate.getTime(),
    });
    expect(result.testExecError).toEqual(null);
  });

  it('handle failure', async () => {
    const error = new Error('Error!');
    mockRun.mockImplementationOnce(() => {
      throw error;
    });

    const result = await run({
      config: {
        cacheDirectory: '/tmp',
      },
      testPath: 'tests/ExampleTest.php',
    });

    const outputFile = '/tmp/jest-runner-phpunit-tests-ExampleTest.php.xml';
    expect(Worker).toHaveBeenCalledWith(require.resolve('../phpunit'));

    expect(mockRun).toHaveBeenCalledWith('tests/ExampleTest.php', outputFile);
    expect(mockParseResult).not.toHaveBeenCalledWith(outputFile);
    expect(mockCleanUp).toHaveBeenCalledWith(outputFile);
    expect(mockEnd).toHaveBeenCalled();

    expect(result.testFilePath).toBe('tests/ExampleTest.php');
    expect(result.perfStats).toEqual({
      start: mockDate.getTime(),
      end: mockDate.getTime(),
    });
    expect(result.testExecError).toEqual(error);
  });
});
