import { loggerWithTags } from '../index';
test('log test', () => {
  const { log } = loggerWithTags('test');
  expect(log('test log')).toBe(void 0);
});
