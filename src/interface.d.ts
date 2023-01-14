declare namespace Logger {
    export type Evn = 'all' | 'production' | 'development' | 'none';
    /** 日志输入配置选项 */
    export interface IOptions {
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
        env?: Evn;
    }
}
