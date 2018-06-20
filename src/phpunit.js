import { exec } from 'child_process';
import fs from 'fs';
import { parseString } from 'xml2js';

const run = (testPath, outputFile) => new Promise((resolve, reject) => {
  exec(`phpunit --no-coverage --log-junit=${outputFile} ${testPath}`, (error) => {
    if (error && error.signal) {
      return reject(error);
    }

    return resolve();
  });
});

const cleanUp = file => fs.unlinkSync(file);

const parse = (result) => {
  const output = result.testsuites.testsuite[0];

  return {
    failures: parseInt(output.$.failures, 0),
    passes: parseInt(output.$.tests, 0) - parseInt(output.$.failures, 0),
    tests: output.testcase.map(testcase => ({
      ancestorTitles: [],
      duration: parseFloat(testcase.$.time) * 1000,
      title: testcase.$.name,
      fullName: `${testcase.$.class}::${testcase.$.name}`,
      failureMessages: testcase.failure ? testcase.failure.map(failure => failure._) : [],
      status: testcase.failure ? 'failed' : 'passed',
      numPassingAsserts: testcase.$.assertions,
    })),
  };
};

const parseResult = file => new Promise((resolve, reject) => {
  const xml = fs.readFileSync(file);
  parseString(xml, (error, result) => {
    if (error) {
      return reject(error);
    }

    return resolve(parse(result));
  });
});

module.exports = {
  run,
  cleanUp,
  parseResult,
};
