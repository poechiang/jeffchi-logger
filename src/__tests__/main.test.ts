import path from 'path';
import { withTags } from '../index';
import { ILogOptions } from '../interface';
const currVersion = '4.0.0';
const testLogFile = 'logs/test/' + path.basename(__filename).replace(/(\.(test|spec))\.ts$/, '$1.log');
const testOptions: ILogOptions = {
  output: { file: testLogFile },
  disableError: true,
  disableWarn: true,
};

test('"MMM dd, yyyy HH:mm:ss.SSS" group test', () => {
  const { assert, success,log, warn, info, error, debug } = withTags([currVersion, 'test'], {
    ...testOptions,
    output: { file: testLogFile, groupByLevel: true },
    date: 'MMM dd, yyyy HH:mm:ss.SSS',
  });

  expect(assert(true,'test true assert')).toBeUndefined();
  expect(assert(false,'test false assert')).toBeUndefined();
  expect(success('test success')).toBeUndefined();
  expect(debug('test debug')).toBeUndefined();
  expect(info('test info')).toBeUndefined();
  expect(log('test log')).toBeUndefined();
  expect(warn('test warn...')).toBeUndefined();
  expect(error('test error...')).toBeUndefined();
});

test.todo(
  `All current test cases have ended, please check the test log file "${process.cwd()}/${testLogFile}" to measure the final test results `,
);

afterAll((done) => {
  // 所有的日志文件最长1秒,等文件写入后再结束
  setTimeout(done, 2000);
});
