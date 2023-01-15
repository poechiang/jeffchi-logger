import { format } from 'date-fns';
import { ILogOptions } from '../interface';
import { isString } from './type';

export const buildLogPreffix = (tags: string[], options: ILogOptions) => {
  const { date } = options;
  const prefix: any[] = [];
  if (tags.length) {
    prefix.unshift(tags.map((t) => `[${t.toUpperCase()}]`).join(' '));
  }
  if (date) {
    const now: Date = new Date();
    let dtStr: string;
    if (isString(date)) {
      dtStr = format(now, date as string);
    } else {
      dtStr = new Date(now).toISOString();
    }
    prefix.unshift(dtStr);
  }
  return prefix;
};
