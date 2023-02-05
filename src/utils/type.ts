/**
 * Object.prototype.toString
 * @param v
 * @returns
 */
const toString = (v: any): string => Object.prototype.toString.call(v);

/**
 * 检查给定值是否为undefined
 * @param v
 * @returns
 */
export const isUndefined = (v: any) => v === undefined;
/**
 * 检查给定值是否为字符串
 * @param v
 * @returns
 */
export const isString = (v: any) => typeof v === 'string' || toString(v) === '[object String]';
/**
 * 检查给定值是否数组
 */
export const isArray = Array.isArray;
/**
 * 检查给定值是否为数字
 */
export const isNumber = Number.isInteger;
