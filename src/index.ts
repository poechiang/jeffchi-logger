import { LogCache } from './cache';
import { defOptions } from './consts/defOptions';
import { ILogger, ILogOptions, LogLevel, LogMode, LogOutputOptions, LogTags } from './interface';
import { checkEnv } from './utils/checkEnv';
import { isBrowser } from './utils/checkPlateform';
import { format } from './utils/format';
import { isString } from './utils/type';

const outputLogFile = (level: LogLevel, args: any[], options: ILogOptions) => {
  const { output, levels = [] } = options;
  const logOutputOptions = (isString(output) ? { file: output } : output) as LogOutputOptions;
  if (!levels?.length || levels.includes(LogLevel.SUCCESS)) {
    LogCache.cache.push(
      {
        level,
        data: [...args.reduce((list, arg) => [...list, arg[1]], [])],
      },
      logOutputOptions,
    );
  }
};
const outputLogTerminal = (outFn: (...args: any[]) => void, fmtStr: string, args: any[], options: ILogOptions) => {
  const { env = LogMode.ALL, color = true } = options;
  if (checkEnv(env ?? LogMode.ALL)) {
    if (color !== false) {
      outFn(fmtStr, ...args.reduce((list, arg) => [...list, ...arg], []));
    } else {
      outFn(...args.reduce((list, arg) => [...list, arg[1]], []));
    }
  }
};
/**
 * 出口方法,
 * @param tags 标签或标签列表,统一转换为大写输出
 * @param options ILogOptions
 * @returns
 */
export const withTags = (tags: LogTags, options?: ILogOptions): ILogger => {
  const mergedOptions = { ...defOptions, ...options };

  const assert = (value: boolean, ...args: any[]) => {
    const formatDataList = format(LogLevel.ASSERT, { tags, args }, options);

    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    if (checkEnv(mergedOptions.env ?? LogMode.ALL)) {
      if (!isBrowser()) {
        console.assert(
          value,
          rest.reduce((list, arg) => [...list, ...(mergedOptions.color === false ? [arg[1]] : arg)], []).join(' '),
        );
      } else {
        if (mergedOptions.color === false) {
          console.assert(value, ...rest.reduce((list, arg) => [...list, arg[1]], []));
        } else {
          console.assert(value, fmtStr, ...rest.reduce((list, arg) => [...list, ...arg], []));
        }
      }
    }
    if (!value) {
      outputLogFile(LogLevel.ASSERT, rest, mergedOptions);
    }
  };
  const success = (...args: any[]) => {
    const formatDataList = format(LogLevel.SUCCESS, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    outputLogTerminal(console.log, fmtStr, rest, mergedOptions);
    outputLogFile(LogLevel.SUCCESS, rest, mergedOptions);
  };
  const debug = (...args: any[]) => {
    const formatDataList = format(LogLevel.DEBUG, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    outputLogTerminal(console.debug, fmtStr, rest, mergedOptions);
    outputLogFile(LogLevel.DEBUG, rest, mergedOptions);
  };
  const info = (...args: any[]) => {
    const formatDataList = format(LogLevel.INFO, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    outputLogTerminal(console.info, fmtStr, rest, mergedOptions);
    outputLogFile(LogLevel.INFO, rest, mergedOptions);
  };
  const log = (...args: any[]) => {
    const formatDataList = format(LogLevel.LOG, { tags, args }, options);
    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    outputLogTerminal(console.log, fmtStr, rest, mergedOptions);
    outputLogFile(LogLevel.LOG, rest, mergedOptions);
  };
  const warn = (...args: any[]) => {
    const formatDataList = format(LogLevel.WARN, { tags, args }, options);

    const fmtStr = formatDataList.reduce((str, [fmt, ...rest]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    const { disableError } = mergedOptions;
    const out = disableError ? console.log : console.warn;

    outputLogTerminal(out, fmtStr, rest, mergedOptions);
    outputLogFile(LogLevel.WARN, rest, mergedOptions);
  };

  const error = (msg: string, cause?: Error) => {
    const formatDataList = format(LogLevel.ERROR, { tags, args: [msg, cause] }, options);

    const fmtStr = formatDataList.reduce((str, [fmt]) => str + fmt, '');
    const rest = formatDataList.reduce((list, [_, ...rest]) => [...list, rest], []) as any[];

    const { disableThrow, disableError } = mergedOptions;
    const out = disableError ? console.log : console.error;
    outputLogTerminal(out, fmtStr, rest, mergedOptions);

    outputLogFile(LogLevel.ERROR, rest, mergedOptions);

    // ignoreTrow默认行为改为true
    if (disableThrow === false) {
      throw new Error(msg, { cause });
    }
  };
  return { assert, debug, info, log, warn, error, success };
};
