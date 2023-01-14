import { defOptions } from './consts/defOptions';
import { ILogger, ILogOptions, LogLevel, LogMode, LogTags } from './interface';
import { buildLogPreffix } from './utils/buildLogPreffix';
import { checkLogMode } from './utils/checkLogMode';
import { checkPlatform } from './utils/checkPlateform';
import { isArray } from './utils/type';
import { writeLogFile } from './utils/writeFile';

export const loggerWithTags = (tags: LogTags, options?: ILogOptions): ILogger => {
  if (!isArray(tags)) {
    tags = [tags];
  }

  const { env, ...mergedOptions } = { ...defOptions, ...(options || {}) };

  const debug = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.DEBUG, ...mergedOptions });
    const content = [...prefix, ...rest];
    checkLogMode(env || LogMode.ALL) && console.debug(...content);
    checkPlatform().then((writer) => writeLogFile(writer, content));
  };
  const info = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.INFO, ...mergedOptions });
    const content = [...prefix, ...rest];
    checkLogMode(env || LogMode.ALL) && console.info(...content);
    checkPlatform().then((writer) => writeLogFile(writer, content));
  };
  const log = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], mergedOptions);
    const content = [...prefix, ...rest];
    checkLogMode(env || LogMode.ALL) && console.log(...content);
    checkPlatform().then((writer) => writeLogFile(writer, content));
  };
  const warn = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.WARN, ...mergedOptions });
    const content = [...prefix, ...rest];
    checkLogMode(env || LogMode.ALL) && console.warn(...content);
    checkPlatform().then((writer) => writeLogFile(writer, content));
  };

  const error = (msg: string, cause?: Error) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.ERROR, ...mergedOptions });
    const content = [...prefix, msg];
    checkLogMode(env || LogMode.ALL) && console.error(...content);
    checkPlatform().then((writer) => writeLogFile(writer, content));
    throw new Error(msg, { cause });
  };
  return { debug, info, log, warn, error };
};
