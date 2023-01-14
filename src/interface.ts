/**
 * 日志输出打印的模式
 * @default LogMode.ALL
 */
export enum LogMode {
  ALL = 'all',
  PRODUCTION = 'production',
  DEVELOPMENET = 'development',
  NONE = 'none',
}
export type LogTags = string | string[];
/** 日志输入配置选项 */
export interface ILogOptions {
  /**
   * 是否支持输出时间戳及时间戳格式
   *
   * 字符串格式参见: https://github.com/date-fns/date-fns/blob/main/src/format/index.ts
   * @default true - 'MMM dd, yyyy HH:mm:ss.SSS'
   */
  date?: boolean | string;
  /**
   * 日志输出条件,默认全部输出
   * @default 'all'
   */
  env?: LogMode;
}

export interface ILogger {
  debug: (...rest: any[]) => void;
  info: (...rest: any[]) => void;
  log: (...rest: any[]) => void;
  warn: (...rest: any[]) => void;
  error: (msg: string) => void;
}
