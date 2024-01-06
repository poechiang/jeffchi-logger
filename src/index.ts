import { LogCache } from './cache';
import { defOptions } from './consts/defOptions';
import { format } from './format';
import { ILogger, ILogOptions, LogLevel, LogMode, LogOutputOptions, LogTags } from './interface';
import { checkEnv } from './utils/checkEnv';
import { isString } from './utils/type';

/**
 * 出口方法,
 * @param tags 标签或标签列表,统一转换为大写输出
 * @param options ILogOptions
 * @returns
 */
export const withTags = (tags: LogTags, options?: ILogOptions): ILogger => {
  const { env = LogMode.ALL, output, levels = [], ...mergedOptions } = { ...defOptions, ...options };
  const logOutputOptions = (isString(output) ? { file: output } : output) as LogOutputOptions;

  const assert = (value: boolean, ...args: any[]) => {
    const formatDataList = format(LogLevel.ASSERT, { tags, args }, options);

    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    checkEnv(env) && console.assert(value, fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!value && (!levels?.length || levels.includes(LogLevel.ASSERT))) {
      LogCache.cache.push(
        {
          level: LogLevel.ASSERT,
          data: [...rest.reduce((list, arg) => [...list, arg[0]], [])],
        },
        logOutputOptions,
      );
    }
  };
  const success = (...args: any[]) => {
    const formatDataList = format(LogLevel.SUCCESS, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    checkEnv(env) && console.log(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!levels?.length || levels.includes(LogLevel.SUCCESS)) {
      LogCache.cache.push(
        {
          level: LogLevel.SUCCESS,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }
  };
  const debug = (...args: any[]) => {
    const formatDataList = format(LogLevel.DEBUG, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    checkEnv(env) && console.debug(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!levels?.length || levels.includes(LogLevel.DEBUG)) {
      LogCache.cache.push(
        {
          level: LogLevel.DEBUG,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }
  };
  const info = (...args: any[]) => {
    const formatDataList = format(LogLevel.INFO, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    checkEnv(env) && console.info(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!levels?.length || levels.includes(LogLevel.INFO)) {
      LogCache.cache.push(
        {
          level: LogLevel.INFO,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }
  };
  const log = (...args: any[]) => {
    const formatDataList = format(LogLevel.LOG, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    checkEnv(env) && console.log(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!levels?.length || levels.includes(LogLevel.LOG)) {
      LogCache.cache.push(
        {
          level: LogLevel.LOG,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }
  };
  const warn = (...args: any[]) => {
    const formatDataList = format(LogLevel.LOG, { tags, args }, options);

    const fmtStr = formatDataList.reduce((str, [fmt, ...rest]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    const { disableError } = mergedOptions;
    const out = disableError ? console.log : console.warn;

    checkEnv(env) && out(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
    if (!levels?.length || levels.includes(LogLevel.WARN)) {
      LogCache.cache.push(
        {
          level: LogLevel.WARN,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }
  };

  const error = (msg: string, cause?: Error) => {
    const formatDataList = format(LogLevel.LOG, { tags, args: [msg, cause] }, options);

    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    const { disableThrow, disableError } = mergedOptions;
    const out = disableError ? console.log : console.error;
    checkEnv(env || LogMode.ALL) && out(fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));

    if (!levels?.length || levels.includes(LogLevel.ERROR)) {
      LogCache.cache.push(
        {
          level: LogLevel.ERROR,
          data: [...rest.reduce((list, arg) => [...list, arg[1]], [])],
        },
        logOutputOptions,
      );
    }

    // ignoreTrow默认行为改为true
    if (disableThrow === false) {
      throw new Error(msg, { cause });
    }
  };
  return { assert, debug, info, log, warn, error, success };
};
