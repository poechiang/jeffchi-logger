import { ILogOptions, LogLevel, LogTags } from '../interface';
import { isArray, isString } from './type';

import * as fns from 'date-fns';
import * as browserColorPalete from '../consts/colorPalette.browser';
import * as nodeColorPalete from '../consts/colorPalette.node';
import * as levelTagMap from '../consts/levelTagMap';
import { isBrowser } from './checkPlateform';
const tagColorMap: any = {};
const randomColor = (a: number = 1) => {
  if (isBrowser()) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } else {
    // 随机颜色仅应用于标签，范围为40-47，100-107
    const list = [40, 41, 42, 43, 44, 45, 46, 47, 100, 101, 102, 103, 104, 105, 106, 107];
    const r = list[Math.floor(Math.random() * list.length)];
    return `\x1b[${r}m`;
  }
};

const getColor = (arg: any) => {
  const colorPalete = isBrowser() ? browserColorPalete : nodeColorPalete;
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

const buildLabelItem = (color: string, value: any, options?: { backColor?: boolean; fmtTag?: string }) => {
  if (isBrowser()) {
    if (options?.backColor) {
      return [
        `%c${options?.fmtTag ?? '%s'}%c `,
        `background-color:${color};padding-inline:4px;border-radius:2px;`,
        value,
        '',
      ];
    } else {
      return [`%c${options?.fmtTag ?? '%s'}%c `, `color:${color}`, value, ''];
    }
  } else {
    return [`%s${options?.fmtTag ?? '%s'}%s `, color, value, '\x1b[m'];
  }
};
export const format = (level: LogLevel, data: { tags: LogTags; args: any[] }, options?: ILogOptions) => {
  const colorPalete = isBrowser() ? browserColorPalete : nodeColorPalete;
  const date = options?.date ?? true;
  const labels = [];
  if (date !== false) {
    const now = new Date();

    labels.push(
      buildLabelItem(colorPalete.timestamp, isString(date) ? fns.format(now, date as string) : now.toISOString()),
    );
  }
  // 日志级别颜色
  const levelColor = colorPalete[level];
  labels.push(buildLabelItem(levelColor, `[${levelTagMap[level]}]`));
  const { tags, args } = data || {};
  const tagList = (isArray(tags) ? tags : tags.split(',')).reduce((list: string[][], tag: string) => {
    const tagColor = tagColorMap[tag] || (tagColorMap[tag] = randomColor());
    return [...list, buildLabelItem(tagColor, tag.toUpperCase(), { backColor: true })];
  }, []);

  const argsList = args.reduce((list: string[][], arg: any) => {
    const argColor = getColor(arg) ?? levelColor;
    return [...list, buildLabelItem(argColor, arg, { fmtTag: getFmtTag(arg) })];
  }, []);

  return [...labels, ...tagList, ...argsList];
};
