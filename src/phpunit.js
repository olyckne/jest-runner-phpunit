import { exec } from 'child_process';
import fs from 'fs';
import { parseString } from 'xml2js';

const run = (testPath, outputFile) => new Promise((resolve, reject) => {
  exec(`./vendor/bin/phpunit --no-coverage --log-junit=${outputFile} ${testPath}`, (error) => {
    if (error && error.signal) {
      return reject(error);
    }

    return resolve();
  });
});

const cleanUp = file => fs.unlinkSync(file);

const mapTestcases = function mapTestcases(testcases) {
  return testcases.map(testcase => ({
    ancestorTitles: [],
    duration: parseFloat(testcase.$.time) * 1000,
    title: testcase.$.name,
    fullName: `${testcase.$.class}::${testcase.$.name}`,
    failureMessages: testcase.failure ? testcase.failure.map(failure => failure._) : [],
    status: testcase.failure ? 'failed' : 'passed',
    numPassingAsserts: parseInt(testcase.$.assertions, 0),
  }));
};

const parse = (result) => {
  const output = result.testsuites.testsuite[0];

  return {
    failures: parseInt(output.$.failures, 0),
    passes: parseInt(output.$.tests, 0) - parseInt(output.$.failures, 0),
    tests: [
      ...(output.testcase ? mapTestcases(output.testcase) : []),
      ...(output.testsuite ? output.testsuite.reduce((allTests, testSuite) =>
        [...allTests, ...mapTestcases(testSuite.testcase)], [])
        : []
      ),
    ],
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
