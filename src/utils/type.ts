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
 * 检查给定值是否为null
 * @param v
 * @returns
 */
export const isNull = (v: any) => v === null;
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
 * 检查给定值是否为类数组
 */
export const isArrayLike = (v: any) => {
  return isArray(v) || (isNumber(v?.length) && v.length >= 0);
};

/**
 * 检查给定值是否为数字
 */
export const isNumber = Number.isInteger;

/**
 * 检查给定值是否无效值
 */
export const isNone = (v: any) => isUndefined(v) || isNull(v);

/**
 * 检查给定值是否空值
 */
export const isEmpty = (v: any) => {
  if (isNone(v)) {
    return true;
  }
  if (isString(v)) {
    return v.length === 0;
  }
  if (isArray(v)) {
    return v.length === 0;
  }
  if (isNumber(v)) {
    return v === 0;
  }
  return false;
};
