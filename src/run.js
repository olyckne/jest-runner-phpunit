import Worker from 'jest-worker';
import { jestError, jestResult } from './jest-result';

const generateUniqueFilename = (cacheDirectory, testPath) => {
  const file = testPath.replace(/\//gi, '-');
  return `${cacheDirectory}/jest-runner-phpunit-${file}.xml`;
};

const phpunit = async ({ config, testPath }) => {
  let result = {};

  const outputFile = generateUniqueFilename(config.cacheDirectory, testPath);

  const worker = new Worker(require.resolve('./phpunit'));

  const start = +new Date();
  try {
    await worker.run(testPath, outputFile);
    const output = await worker.parseResult(outputFile);
    const end = +new Date();

    result = jestResult({
      ...output,
      start,
      end,
      path: testPath,
    });
  } catch (error) {
    const end = +new Date();
    result = jestError({
      error,
      start,
      end,
      path: testPath,
    });
  }

  await worker.cleanUp(outputFile);
  worker.end();

  return result;
};

export default phpunit;
