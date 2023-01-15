import { isNumber } from './type';

interface IDebounceOptions {
  immediate?: boolean;
  wait: number;
}
export type DebounceOptions = IDebounceOptions | number;
// immediate 表示第一次是否立即执行
export const debounce = (fn: CallableFunction, options: DebounceOptions) => {
  let timer: NodeJS.Timeout | null = null;
  if (isNumber(options)) {
    options = { wait: options } as IDebounceOptions;
  } else {
    options = options as IDebounceOptions;
  }
  const { immediate, wait = 100 } = options || {};
  return (...args: any) => {
    if (timer) clearTimeout(timer);

    // immediate 为 true 表示第一次触发后执行
    // timer 为空表示首次触发
    if (immediate && !timer) {
      fn(...args);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  };
};
