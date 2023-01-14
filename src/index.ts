import { format } from 'date-fns';
import { ILogger, ILogOptions, LogMode } from './interface';
import { buildOutputPreffix, checkEnv, checkPlatform, noop } from './utils';

const defOptions: ILogOptions = {
  date: true,
  env: LogMode.ALL,
};

export const loggerWithTags = (tags: string | string[], options?: ILogOptions): ILogger => {
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  const { env, ...mergedOptions } = { ...defOptions, ...(options || {}) };

  const debug = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || LogMode.ALL) && console.debug(prefix, ...rest);
  };
  const info = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || LogMode.ALL) && console.info(prefix, ...rest);
  };
  const log = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || LogMode.ALL) && console.log(...prefix, ...rest);
    checkPlatform().then((write) =>
      write?.(
        `logs/${format(Date.now(), 'yyyy-MM-dd')}.log`,
        [...prefix, ...rest.map(JSON.stringify as any), '\n'].join(' '),
        { flag: 'a' },
        noop,
      ),
    );
  };
  const warn = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || LogMode.ALL) && console.warn(prefix, ...rest);
  };

  const error = (msg: string) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    if (checkEnv(env || LogMode.ALL)) {
      console.warn(prefix);
      throw new Error(msg);
    }
  };
  return { debug, info, log, warn, error };
};
