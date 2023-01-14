import { format } from 'date-fns';
import { ILogOptions, LogLevel } from '../interface';
import { isString } from './type';

export const buildLogPreffix = (tags: string[], options: ILogOptions) => {
  const { level = LogLevel.LOG, date } = options;
  const prefix: any[] = [level.toString()];
  if (tags.length) {
    prefix.unshift(tags.map((t) => `[${t.toUpperCase()}]`).join(' '));
  }
  if (date) {
    let now: Date | string = new Date();

    if (isString(date)) {
      now = format(now, date as string);
    }
    prefix.unshift(now);
  }
  return prefix;
};
