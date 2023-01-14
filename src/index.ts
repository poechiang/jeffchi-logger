import { defOptions } from './consts/defOptions';
import { ILogger, ILogOptions, LogLevel, LogMode, LogTags } from './interface';
import { buildLogPreffix } from './utils/buildLogPreffix';
import { checkLogMode } from './utils/checkLogMode';
import { checkPlatform } from './utils/checkPlateform';
import { isArray } from './utils/type';
import { writeLogFile } from './utils/writeLogFile';

export const loggerWithTags = (tags: LogTags, options?: ILogOptions): ILogger => {
  if (!isArray(tags)) {
    tags = [tags];
  }

  const { env, outputFile, ...mergedOptions } = { ...defOptions, ...(options || {}) };

  const debug = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.DEBUG, ...mergedOptions });

    checkLogMode(env || LogMode.ALL) && console.debug([...prefix, ...rest]);
    checkPlatform().then((writer) => writeLogFile(writer, { prefix, outputFile, data: [...rest] }));
  };
  const info = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.INFO, ...mergedOptions });

    checkLogMode(env || LogMode.ALL) && console.info([...prefix, ...rest]);
    checkPlatform().then((writer) => writeLogFile(writer, { prefix, outputFile, data: [...rest] }));
  };
  const log = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], mergedOptions);

    checkLogMode(env || LogMode.ALL) && console.log([...prefix, ...rest]);
    checkPlatform().then((writer) => writeLogFile(writer, { prefix, outputFile, data: [...rest] }));
  };
  const warn = (...rest: any[]) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.WARN, ...mergedOptions });
    const { disableError } = mergedOptions;
    const out = disableError ? console.debug : console.warn;
    checkLogMode(env || LogMode.ALL) && out([...prefix, ...rest]);
    checkPlatform().then((writer) => writeLogFile(writer, { prefix, outputFile, data: [...rest] }));
  };

  const error = (msg: string, cause?: Error) => {
    const prefix = buildLogPreffix(tags as string[], { level: LogLevel.ERROR, ...mergedOptions });
    const { ignoreThrow, disableError } = mergedOptions;
    const out = disableError ? console.debug : console.error;
    checkLogMode(env || LogMode.ALL) && out([...prefix, msg]);

    checkPlatform().then((writer) => writeLogFile(writer, { prefix, outputFile, data: [msg] }));
    if (!ignoreThrow) {
      throw new Error(msg, { cause });
    }
  };
  return { debug, info, log, warn, error };
};
