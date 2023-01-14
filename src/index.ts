import { format } from "date-fns";
<<<<<<< HEAD
import { Logger } from "./interface";
=======
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e
import { buildOutputPreffix, checkEnv, checkPlatform, noop } from "./utils";

const defOptions: Logger.IOptions = {
  date: true,
<<<<<<< HEAD
  env: Logger.Evn.ALL,
=======
  env: "all",
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e
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
<<<<<<< HEAD
    checkEnv(env || Logger.Evn.ALL) && console.debug(prefix, ...rest);
  };
  const info = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.info(prefix, ...rest);
  };
  const log = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || Logger.Evn.ALL) && console.log(...prefix, ...rest);
=======
    checkEnv(env || "all") && console.debug(prefix, ...rest);
  };
  const info = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || "all") && console.info(prefix, ...rest);
  };
  const log = (...rest: any[]) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
    checkEnv(env || "all") && console.log(...prefix, ...rest);
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e
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
<<<<<<< HEAD
    checkEnv(env || Logger.Evn.ALL) && console.warn(prefix, ...rest);
=======
    checkEnv(env || "all") && console.warn(prefix, ...rest);
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e
  };

  const error = (msg: string) => {
    const prefix = buildOutputPreffix(tags as string[], mergedOptions);
<<<<<<< HEAD
    if (checkEnv(env || Logger.Evn.ALL)) {
=======
    if (checkEnv(env || "all")) {
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e
      console.warn(prefix);
      throw new Error(msg);
    }
  };
  return { debug, info, log, warn, error };
};
