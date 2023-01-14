import path from 'path';
import { loggerWithTags } from '../index';
import { ILogOptions } from '../interface';
const currVersion = '1.0.3';
const testLogFile = 'logs/test/' + path.basename(__filename).replace(/(\.(test|spec))\.ts$/, '$1.log');
const testOptions: ILogOptions = {
  outputFile: testLogFile,
  ignoreThrow: true,
  disableError: true,
  disableWarn: true,
};

test(`${currVersion} test!`, () => {
  const { log } = loggerWithTags('test', testOptions);
  expect(log('test log')).toBe(void 0);
});

test.todo(
  `All current test cases have ended, please check the test log file "${process.cwd()}/${testLogFile}" to measure the final test results `,
);

afterAll((done) => {
  // 所有的日志文件最长1秒,等文件写入后再结束
  setTimeout(done, 2000);
});
