import { ILogOptions, LogLevel, LogTags } from '../interface';
import { isArray, isString } from './type';

import * as fns from 'date-fns';
import * as browserColorPalete from '../consts/colorPalette.browser';
import * as nodeColorPalete from '../consts/colorPalette.node';
import * as levelTagMap from '../consts/levelTagMap';
import { isBrowser } from './checkPlateform';
const tagColorMap: any = {};
const randomColor = () => {
  if (isBrowser()) {
    const r = Math.floor(Math.random() * 128)
      .toString(16)
      .padStart(2, '0');
    const g = Math.floor(Math.random() * 128)
      .toString(16)
      .padStart(2, '0');
    const b = Math.floor(Math.random() * 128)
      .toString(16)
      .padStart(2, '0');
    return `#${r}${g}${b}`;
  } else {
    // 随机颜色仅应用于标签，范围为40-47，100-107
    const list = [40, 100, 41, 101, 42, 102, 43, 103, 44, 104, 45, 105, 46, 106, 47, 107];
    const idx = Math.floor(Math.random() * list.length);
    const bc = list[idx];
    const fc = list[list.length - idx - 1];
    return `\x1b[${fc - 10}m\x1b[${bc}m`;
  }
};

const getColor = (arg: any) => {
  const colorPalette: any = isBrowser() ? browserColorPalete : nodeColorPalete;
  if (arg === null || arg === undefined) {
    return colorPalette.$empty;
  }
  const atype = arg.constructor.name.toLocaleLowerCase();
  return colorPalette[`$${atype}`];
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
        `color:${color};background-color:${color}3f;padding-inline:4px;border-radius:2px;`,
        value,
        '',
      ];
    } else {
      return [`%c${options?.fmtTag ?? '%s'}%c `, `color:${color}`, value, ''];
    }
  } else {
    return [`%s${options?.fmtTag ?? '%s'}%s `, color, value, '\x1b[0m'];
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
