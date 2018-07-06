import fs from 'fs';
import childProcess from 'child_process';
import xml2js from 'xml2js';
import { run, cleanUp, parseResult } from '../phpunit';

jest.mock('xml2js');

jest.mock('fs', () => ({
  readFileSync: require.requireActual('fs').readFileSync,
  unlinkSync: jest.fn(),
}));

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('PHPUnit', async () => {
  it('fails to parse result from Cobertura format', async () => {
    let error = null;
    try {
      xml2js.parseString.mockImplementationOnce((file, cb) => cb('NO!', null));
      await parseResult(`${__dirname}/fixture.xml`);
      expect(true).toEqual(false);
    } catch (e) {
      error = e;
    }
    expect(error).toBe('NO!');
  });

  it('parses result from Cobertura format', async () => {
    xml2js.parseString.mockImplementationOnce(require.requireActual('xml2js').parseString);
    const result = await parseResult(`${__dirname}/fixture.xml`);

    expect(result).toEqual({
      failures: 1,
      passes: 1,
      tests: [{
        ancestorTitles: [],
        duration: 6.634,
        title: 'testItWorks',
        fullName: 'ExampleTest::testItWorks',
        failureMessages: [],
        status: 'passed',
        numPassingAsserts: 1,
      },
      {
        ancestorTitles: [],
        duration: 4.74,
        title: 'testItFails',
        fullName: 'ExampleTest::testItFails',
        failureMessages: ['ExampleTest::testItFails\n' +
   'Failed asserting that false is true.\n\n' +

   '/Users/mattias.lyckne/Code/Olyckne/jest-runner-phpunit/examples/simple/tests/ExampleTest.php:12\n'],
        status: 'failed',
        numPassingAsserts: 1,
      },
      ],
    });
  });

  it('cleanup after itself', () => {
    cleanUp('file.xml');

    expect(fs.unlinkSync).toHaveBeenCalledWith('file.xml');
  });

  it('runs phpunit command', async () => {
    childProcess.exec.mockImplementationOnce((cmd, cb) => cb());
    await run('tests', 'output.xml');

    expect(childProcess.exec).toHaveBeenCalledWith('./vendor/bin/phpunit --no-coverage --log-junit=output.xml tests', expect.anything());
  });

  it('handle failures of phpunit command', async () => {
    let error = null;
    childProcess.exec.mockImplementationOnce((cmd, cb) => cb({
      signal: 1,
    }));
    try {
      await run('tests', 'output.xml');
    } catch (e) {
      error = e;
    }

    expect(error).toEqual({ signal: 1 });
  });
});
