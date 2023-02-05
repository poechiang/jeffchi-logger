export type PathLike = string | Buffer | URL;

/**
 * 日志输出打印的模式
 * @default LogMode.ALL
 */
export enum LogMode {
  /**
   * 默认,所有模式下都会打印输出
   */
  ALL = 'all',
  /**
   * 仅开发模式启用日志打印输出
   */
  PRODUCTION = 'production',
  /**
   * 仅生产模式下启用日志打印输出
   */
  DEVELOPMENET = 'development',
  NONE = 'none',
}
/**
 * 日志级别
 */
export enum LogLevel {
  LOG = 'LOG',
  WARN = 'WARN',
  INFO = 'INFO',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}
/** 日志标签 */
export type LogTags = string | string[];
export type LogOutputOptions = {
  /**
   * 基于当前工程根目录下的日志输出文件
   */
  file: string;
  /**
   * 日志文件是否按日志级别分组,如果设置分组,则在日志文件中不在输出表示级别的tag:[LOG][INFO][WARN][ERROR]等,日志文件名称对应添加*.(log|info|warn|error).log
   */
  groupByLevel?: boolean;
};
/** 日志配置选项 */
export interface ILogOptions {
  /** 日志级别
   * @default LogLevel.LOG
   */
  levels?: LogLevel[];
  /**
   * 是否支持输出时间戳及时间戳格式
   *
   * 字符串格式参见: https://github.com/date-fns/date-fns/blob/main/src/format/index.ts
   * @default true 开启后默认IOS格式 'yyyy-MM-ddTHH:mm:ss.SSSZ'
   */
  date?: boolean | string;
  /**
   * 日志输出条件,默认全部输出
   * @default LogMode.All
   */
  env?: LogMode;
  /** 禁用warn输出,避免在测试场景下影响测试结果
   * @default false
   */
  disableWarn?: boolean;
  /** 禁用error输出,避免在测试场景下打断正常测试流程
   * @default false
   */
  disableError?: boolean;
  /** 调用error输出错误信息后,禁止继续抛出异常错误
   * @description
   * 调用error输出错误信息后,默认继续抛出异常错误,在测试环境下可以临地禁用,避免影响正常的测试流程
   * @deprecated 由disabledThrow代替
   */
  ignoreThrow?: boolean;
  /** 调用error输出错误信息后,禁止继续抛出异常错误
   * @description
   * 调用error输出错误信息后,默认继续抛出异常错误,在测试环境下可以临地禁用,避免影响正常的测试流程
   */
  disableThrow?: boolean;
  /**
   * 基于当前工程根目录下的日志输出文件
   *
   * @description
   * 浏览器环境:自动忽略该选项;
   *
   * node环境下默认 logs/xxx.log
   * @deprecated 由output代替
   */
  outputFile?: string;
  output?: string | LogOutputOptions;
}

export interface IFileHelper {
  existsSync?: (path: PathLike) => boolean;
  mkdirSync?: (
    path: PathLike,
    options?: {
      mode?: number | string | undefined;
      recursive: true;
    },
  ) => string | undefined;
  writeFile?: CallableFunction;
  join?: (...paths: string[]) => string;
  sep?: '\\' | '/';
  resolve?: (...paths: string[]) => string;
  dirname?: (fn: string) => string;
}
export interface ILogger {
  debug: (...rest: any[]) => void;
  info: (...rest: any[]) => void;
  log: (...rest: any[]) => void;
  warn: (...rest: any[]) => void;
  error: (msg: string) => void;
}
