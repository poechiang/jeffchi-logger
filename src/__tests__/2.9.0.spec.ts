import path from 'path';
import { loggerWithTags } from '../index';
import { ILogOptions } from '../interface';
const currVersion = '2.9.0-rc1';
const testLogFile = 'logs/test/' + path.basename(__filename).replace(/(\.(test|spec))\.ts$/, '$1.log');
const testOptions: ILogOptions = {
  outputFile: testLogFile,
  disableError: true,
  disableWarn: true,
};

test('should throw a error by ignoreThrow', () => {
  const { error } = loggerWithTags([currVersion, 'test'], { ...testOptions, ignoreThrow: false });
  expect(() => {
    try {
      error('should throw a error');
    } catch (e) {
      throw e;
    }
  }).toThrow();
});
test('should throw a error by disableThrow', () => {
  const { error } = loggerWithTags([currVersion, 'test'], { ...testOptions, disableThrow: false });
  expect(() => {
    try {
      error('should throw a error');
    } catch (e) {
      throw e;
    }
  }).toThrow();
});

test('default date test', () => {
  const { log, warn, info, error, debug } = loggerWithTags([currVersion, 'test'], testOptions);
  expect(debug('test debug')).toBeUndefined();
  expect(error('test error')).toBeUndefined();
  expect(info('test info')).toBeUndefined();
  expect(log('test log')).toBeUndefined();
  expect(warn('test warn')).toBeUndefined();
});

test.skip('"MMM dd, yyyy HH:mm:ss.SSS" test', () => {
  const { log, warn, info, error, debug } = loggerWithTags([currVersion, 'test'], {
    ...testOptions,
    date: 'MMM dd, yyyy HH:mm:ss.SSS',
  });

  expect(debug('test debug')).toBeUndefined();
  expect(error('test error')).toBeUndefined();
  expect(info('test info')).toBeUndefined();
  expect(log('test log')).toBeUndefined();
  expect(warn('test warn')).toBeUndefined();
});

test.todo(
  `All current test cases have ended, please check the test log file "${process.cwd()}/${testLogFile}" to measure the final test results `,
);

afterAll((done) => {
  // 所有的日志文件最长1秒,等文件写入后再结束
  setTimeout(done, 2000);
});
