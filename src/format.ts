import { ILogOptions, LogLevel, LogTags } from './interface';
import { isArray, isString } from './utils/type';

import * as fns from 'date-fns';
import * as colorPalete from './consts/colorPalette';
import * as levelTagMap from './consts/levelTagMap';
const tagColorMap: any = {};
const randomColor = (a: number = 1) => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const getColor = (arg: any) => {
  if (arg === null || arg === undefined) {
    return colorPalete.empty;
  }
  const atype = arg.constructor.name.toLocaleLowerCase();
  let argColor;
  if (atype === 'number') {
    argColor = colorPalete.number;
  } else if (atype === 'boolean') {
    argColor = colorPalete.boolean;
  } else if (atype === 'function') {
    argColor = colorPalete.func;
  } else if (atype === 'object') {
    argColor = colorPalete.obj;
  } else if (atype === 'date') {
    argColor = colorPalete.date;
  }

  return argColor;
};
const getFmtTag = (arg: any) => {
  if (arg === null || arg === undefined) {
    return '%s';
  }
  const atype = arg.constructor.name.toLocaleLowerCase();
  if (atype === 'number') {
    return '%f';
  } else if (atype === 'function' || atype === 'object' || arg === null || arg === undefined) {
    return '%o';
  } else {
    return '%s';
  }
};
export const format = (level: LogLevel, data: { tags: LogTags; args: any[] }, options?: ILogOptions) => {
  const date = options?.date ?? true;
  const labels = [];
  if (date !== false) {
    const now = new Date();
    labels.push([
      '%c%s',
      `color:${colorPalete.timestamp}`,
      isString(date) ? fns.format(now, date as string) : now.toISOString(),
    ]);
  }
  // 日志级别颜色
  const levelColor = colorPalete[level];
  labels.push(['%c%s', `color:${levelColor}`, `[${levelTagMap[level]}]`]);
  const { tags, args } = data || {};
  const tagList = (isArray(tags) ? tags : tags.split(',')).reduce((list: string[][], tag: string) => {
    const tagColor = tagColorMap[tag] || (tagColorMap[tag] = randomColor());
    return [...list, ['%c%s', `background-color:${tagColor};padding-inline:4px;border-radius:2px;`, tag.toUpperCase()]];
  }, []);

  const argsList = args.reduce((list: string[][], arg: any) => {
    const argColor = getColor(arg) ?? levelColor;
    const f = getFmtTag(arg);
    return [...list, [`%c${f}%c`, `color:${argColor}`, arg, '']];
  }, []);

  return [...labels, ...tagList, ...argsList];
};
