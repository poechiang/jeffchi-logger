import { LogCache } from './cache';
import { defOptions } from './consts/defOptions';
import { ILogger, ILogOptions, LogLevel, LogMode, LogOutputOptions, LogTags } from './interface';
import { buildLogPreffix } from './utils/buildLogPreffix';
import { checkLogMode } from './utils/checkLogMode';
import { isArray, isString } from './utils/type';

/**
 * 出口方法,
 * @param tags 标签或标签列表,统一转换为大写输出
 * @param options ILogOptions
 * @returns
 * @deprecated 由 withTags代替
 */
export const loggerWithTags = (tags: LogTags, options?: ILogOptions): ILogger => {
  if (!isArray(tags)) {
    tags = [tags];
  }

  const { env, outputFile, output: _out, levels = [], ...mergedOptions } = { ...defOptions, ...(options || {}) };
  const output = (isString(_out) ? { file: _out } : _out || { file: outputFile }) as LogOutputOptions;
  const debug = (...rest: any[]) => {
    const [date, ...prefix] = buildLogPreffix(tags as string[], { ...mergedOptions });
    const prefixList = [date, `[${LogLevel.DEBUG}]`, ...prefix];
    checkLogMode(env || LogMode.ALL) && console.debug(...prefixList, ...rest);
    if (!levels?.length || levels.includes(LogLevel.DEBUG)) {
      LogCache.cache.push({ prefix: prefixList, data: [...rest] }, output);
    }
  };
  const info = (...rest: any[]) => {
    const [date, ...prefix] = buildLogPreffix(tags as string[], { ...mergedOptions });
    const prefixList = [date, `[${LogLevel.INFO}]`, ...prefix];
    checkLogMode(env || LogMode.ALL) && console.info(...prefixList, ...rest);
    if (!levels?.length || levels.includes(LogLevel.INFO)) {
      LogCache.cache.push({ prefix: prefixList, data: [...rest] }, output);
    }
  };
  const log = (...rest: any[]) => {
    const [date, ...prefix] = buildLogPreffix(tags as string[], { ...mergedOptions });
    const prefixList = [date, `[${LogLevel.LOG}]`, ...prefix];
    checkLogMode(env || LogMode.ALL) && console.log(...prefixList, ...rest);
    if (!levels?.length || levels.includes(LogLevel.LOG)) {
      LogCache.cache.push({ prefix: prefixList, data: [...rest] }, output);
    }
  };
  const warn = (...rest: any[]) => {
    const [date, ...prefix] = buildLogPreffix(tags as string[], { ...mergedOptions });
    const prefixList = [date, `[${LogLevel.WARN}]`, ...prefix];
    const { disableError } = mergedOptions;
    const out = disableError ? console.debug : console.warn;
    checkLogMode(env || LogMode.ALL) && out(...prefixList, ...rest);

    if (!levels?.length || levels.includes(LogLevel.WARN)) {
      LogCache.cache.push({ prefix: prefixList, data: [...rest] }, output);
    }
  };

  const error = (msg: string, cause?: Error) => {
    const [date, ...prefix] = buildLogPreffix(tags as string[], { ...mergedOptions });
    const prefixList = [date, `[${LogLevel.ERROR}]`, ...prefix];
    const { disableThrow, ignoreThrow, disableError } = mergedOptions;
    const out = disableError ? console.debug : console.error;
    checkLogMode(env || LogMode.ALL) && out(...prefixList, msg);

    if (!levels?.length || levels.includes(LogLevel.ERROR)) {
      LogCache.cache.push({ prefix: prefixList, data: [msg] }, output);
    }

    // ignoreTrow默认行为改为true
    if (ignoreThrow === false || disableThrow === false) {
      throw new Error(msg, { cause });
    }
  };
  return { debug, info, log, warn, error };
};

/**
 * 新增总出口方法,原方法loggerWithTags废弃
 * @param options ILogOptions
 * @returns
 */
export const withTags = loggerWithTags;
