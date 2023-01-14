import { format } from "date-fns";
import { Logger } from "./interface";
import { buildOutputPreffix, checkEnv, checkPlatform, noop } from "./utils";

const defOptions: Logger.IOptions = {
  date: true,
  env: Logger.Evn.ALL,
};

export const loggerWithTags = (
  tags: string | string[],
  options?: Logger.IOptions
) => {
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  const { env, ...mergedOptions } = { ...defOptions, ...(options || {}) };

  const debug = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.debug(prefix, ...rest);
  };
  const info = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.info(prefix, ...rest);
  };
  const log = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.log(...prefix, ...rest);
    checkPlatform().then((write) =>
      write?.(
        `logs/${format(Date.now(), "yyyy-MM-dd")}.log`,
        [...prefix, ...rest.map(JSON.stringify as any), "\n"].join(" "),
        { flag: "a" },
        noop
      )
    );
  };
  const warn = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.warn(prefix, ...rest);
  };

  const error = (msg: string) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    if (checkEnv(env || Logger.Evn.ALL)) {
      console.warn(prefix);
      throw new Error(msg);
    }
  };
  return { debug, info, log, warn, error };
};
