import { LogCache } from './cache';
import { defOptions } from './consts/defOptions';
import { ILogger, ILogOptions, LogLevel, LogMode, LogTags } from './interface';
import { buildLogPreffix } from './utils/buildLogPreffix';
import { checkLogMode } from './utils/checkLogMode';
import { isArray } from './utils/type';

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

  const { env, outputFile, levels = [], ...mergedOptions } = { ...defOptions, ...(options || {}) };

  const debug = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { ...mergedOptions });
    prefix.unshift(`[${LogLevel.DEBUG}]\t`);
    checkLogMode(env || LogMode.ALL) && console.debug(...prefix, ...rest);
    if (!levels?.length || levels.includes(LogLevel.DEBUG)) {
      LogCache.cache.push({ prefix, timestamp: Date.now(), data: [...rest] }, outputFile);
    }
  };
  const info = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { ...mergedOptions });
    prefix.unshift(`[${LogLevel.INFO}]\t`);
    checkLogMode(env || LogMode.ALL) && console.info(...prefix, ...rest);
    if (!levels?.length || levels.includes(LogLevel.INFO)) {
      LogCache.cache.push({ prefix, timestamp: Date.now(), data: [...rest] }, outputFile);
    }
  };
  const log = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], mergedOptions);
    prefix.unshift(`[${LogLevel.LOG}]\t`);
    checkLogMode(env || LogMode.ALL) && console.log(...prefix, ...rest);
    if (!levels?.length || levels.includes(LogLevel.LOG)) {
      LogCache.cache.push({ prefix, timestamp: Date.now(), data: [...rest] }, outputFile);
    }
  };
  const warn = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { ...mergedOptions });
    prefix.unshift(`[${LogLevel.WARN}]\t`);
    const { disableError } = mergedOptions;
    const out = disableError ? console.debug : console.warn;
    checkLogMode(env || LogMode.ALL) && out(...prefix, ...rest);

    if (!levels?.length || levels.includes(LogLevel.WARN)) {
      LogCache.cache.push({ prefix, timestamp: Date.now(), data: [...rest] }, outputFile);
    }
  };

  const error = (msg: string, cause?: Error) => {
    const prefix = buildLogPreffix(tags as string[], { ...mergedOptions });
    prefix.unshift(`[${LogLevel.ERROR}]\t`);
    const { disableThrow, ignoreThrow, disableError } = mergedOptions;
    const out = disableError ? console.debug : console.error;
    checkLogMode(env || LogMode.ALL) && out(...prefix, msg);

    if (!levels?.length || levels.includes(LogLevel.ERROR)) {
      LogCache.cache.push({ prefix, timestamp: Date.now(), data: [msg] }, outputFile);
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
 */
export const withTags = loggerWithTags;
