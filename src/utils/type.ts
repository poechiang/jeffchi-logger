const toString = (v: any): string => Object.prototype.toString.call(v);

export const isUndefined = (v: any) => v === undefined;
export const isString = (v: any) => typeof v === 'string' || toString(v) === '[object String]';
