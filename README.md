<h1 align="center">
  <a href="https://github.com/poechiang/jeffchi-logger#readme" target="_blank">jeffchi-logger</a>
</h1>

<div align="center">

A log print output javascript tool library that can be used at the front and back ends

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)](https://github.com/facebook/jest)[![Node.js Package](https://github.com/poechiang/jeffchi-logger/actions/workflows/npm-publish.yml/badge.svg?branch=main)](https://github.com/poechiang/jeffchi-logger/actions/workflows/npm-publish.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![actions-cool](https://img.shields.io/badge/using-actions--cool-blue?style=flat-square)](https://github.com/actions-cool)

</div>

## 支持环境

- 现代浏览器。
- 支持服务端使用, 在服务端使用时默认写入 %root%/logs/yyyy-mm-dd.log 日志文件。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge                                                                                                                                                                                                            | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           |

## 安装

### 使用 npm 或 yarn 安装

```bash
$ npm install @jeffchi/logger --save
```

```bash
$ yarn add @jeffchi/logger
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

## 用法

```javascript
import { loggerWithTags } from '@jeffchi/logger';
import { LogLevel, LogMode } from '@jeffchi/logger/lib/interface';
const { debug, error, info, log, warn } = loggerWithTags(
  'api', // ['api','get'] 一个或多个tag
  {
    level: LogLevel.LOG, // 日志级别只有指定级别的日志才会输出至日志文件
    date: 'MMM dd, yyyy HH:mm:ss.sss', // 日志输出的时间戳格式,true表示使用默认utc IOS日期时间格式,false表示不输出时间戳
    env: LogMode.ALL, // 环境参数,开发版本或生产版本,如果指定开发环境,则生产环境不输出任何内容,也不会写入到日志文件
    disableWarn: false, // 禁用Warn输出,用debug代替,仅影响前端控制台和后端终端,不影响实际内容打印.在跑测试时应该启用,避免影响测试结果
    disableError: false, // 禁用Error输出,用debug代替,仅影响前端控制台和后端终端,不影响实际内容打印.在跑测试时应该启用,避免影响测试结果
    ignoreThrow: false, // 默认Error输出后,会抛出异常,从而打断后端执行流程,可指定true取消该行为,在跑测试时应该启用,避免影响测试测试流程
    outputFile: 'logs/<yyyy-MM-dd>.log', // 输出日志文件的位置,仅服务端使用时有效
  },
);
```

## 参数

```javascript
loggerWithTags( tags:LogTags, options:ILogOptions );
```

### tags

```javascript
/** 日志标签 */
export type LogTags = string | string[];
```

### options

```javascript
/** 日志配置选项 */
export interface ILogOptions {
  /** 日志级别
   * @default LogLevel.LOG
   */
  level?: LogLevel;
  /**
   * 是否支持输出时间戳及时间戳格式
   *
   * 字符串格式参见: https://github.com/date-fns/date-fns/blob/main/src/format/index.ts
   * @default true 开启后默认IOS格式 'yyyy-MM-ddTHH:mm:ss.SSSZ'
   */
  date?: boolean | string;
  /**
   * 日志输出条件,默认全部输出
   * @default 'all'
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
   */
  ignoreThrow?: boolean;
  /**
   * 基于当前工程根目录下的日志输出文件
   *
   * @description
   * 浏览器环境:自动忽略该选项;
   *
   * node环境下默认 logs/xxx.log
   */
  outputFile?: string;
}
```

## 测试

`src/__test__` 目录下的 `*.spec.ts` 和 `*.test.ts` 是测试文件.

- `*.spec.ts` 特定于指定版本的测试文件,需要切换到指定版本分支才能保证测试通过
- `*.test.ts` 当前版本的测试文件

> 测试基于 `ts-jest`,终端窗口通过指定参数,来运行特定的测试文件
>
> ```bash
> npm run test 1.0.3  # 1.0.3的测试文件
> npm run test main   # 当前测试文件
> npm run test        # 所有测试文件
> ```

## 构建脚本

通过运行构建脚本,可实现不同的功能

```bash
  npm run name
```

| 脚本名称                                                                                                  | 说明                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clear                                                                                                     | 清理 `lib/` `docs/` `build/`临时目录                                                                                                                                                                                                                                                              |
| doc                                                                                                       | 利用 typedoc 生成 api 文档,位于`docs/`目录下                                                                                                                                                                                                                                                      |
| dev                                                                                                       | 启动开发模式                                                                                                                                                                                                                                                                                      |
| build                                                                                                     | 执行构建过程                                                                                                                                                                                                                                                                                      |
| format                                                                                                    | 利用 prettier 格式化                                                                                                                                                                                                                                                                              |
| lint                                                                                                      | 依赖 tslint 对代码检查                                                                                                                                                                                                                                                                            |
| test                                                                                                      | 依赖 jest 测试代码                                                                                                                                                                                                                                                                                |
| push                                                                                                      | 用指定 message 提交代码并推送至远程                                                                                                                                                                                                                                                               |
| release [`<verson>`\|`patch`\|`minor`\|`major`] -- [`--alpha`\|`--beta`\|`--rc`] [`--all`] [`--otp code`] | 生成新的 `主`\|`次`\|`批` 版本号,推送远程仓库后,并发布至 npm 仓 <blockquote><li> --alpha: 预发布内部版本</li><li> --beta: 预发布公测版本</li><li> -rc: 预发布候选版本</li><li> -all: 提交全部修改</li><li> -otp `<code>`: 如果指定一次性口令,则直接发布到 npm 中心仓,否则不发布</li></blockquote> |

## License

MIT
