import { format } from "date-fns";
<<<<<<< HEAD
import type { Logger } from "./interface";
=======
>>>>>>> 30c7cd43c5261d473f011ebdc28cde4e2779712e

const toString = (v: any): string => Object.prototype.toString.call(v);

export const isUndefined = (v: any) => v === undefined;
export const isString = (v: any) =>
  typeof v === "string" || toString(v) === "[object String]";

export const buildOutputPreffix = (
  tags: string[],
  options: Logger.IOptions
) => {
  const prefix = [];
  const { date } = options;
  if (date) {
    let now: Date | string = new Date();

    if (isString(date)) {
      now = format(now, date as string);
    }
    prefix.unshift(now);
  }
  if (tags.length) {
    prefix.unshift(tags.map((t) => `[${t.toUpperCase()}]`).join(" "));
  }
  return prefix;
};

export const checkEnv = (env: Logger.Evn) =>
  (env === "all" || process.env.NODE_ENV === env) && console !== undefined;

export const checkPlatform = () =>
  import("fs").then((fs) => {
    // fs.opendir('logs')
    return fs?.writeFile;
  });
export const noop = () => void 0;
