import { IFileHelper } from './interface';
import { checkPlatform } from './utils/checkPlateform';

import { format } from 'date-fns';

import { debounce } from './utils/debounce';
import noop from './utils/noop';
import { isArray } from './utils/type';

export interface LogContent {
  prefix?: string[];
  data: any[];
  timestamp: number;
}
/** 单例模式的缓存对像 */
export class LogCache {
  static readonly #cache = new LogCache();
  lastWrite: number = Date.now();
  #map: Map<string, Set<any>>;
  #fs?: IFileHelper | null;
  static get cache(): LogCache {
    return LogCache.#cache;
  }

  get defaultLogFile() {
    return `logs/${format(Date.now(), 'yyyy-MM-dd')}.log`;
  }

  private constructor() {
    this.#map = new Map<string, Set<any>>();

    checkPlatform().then((fs) => {
      this.#fs = fs;
    });
  }

  push(data: LogContent, file?: string) {
    file = file || this.defaultLogFile;
    let set = this.#map.get(file);
    if (!set) {
      set = new Set<any>();
      this.#map.set(file, set);
    }
    const now = Date.now();

    if (set.add(data).size > 1000 || now - this.lastWrite > 30000) {
      this.flush(file);
    } else {
      this.write(file);
    }
  }

  /** 立即写入并清空缓存 */
  flush(file?: string) {
    if (!this.#fs) return;

    this.#map.forEach((set, key) => {
      if (!set) return;
      if ((file === null && key === this.defaultLogFile) || !file || key === file) {
        const list = Array.from<LogContent>(set);
        set.clear();
        this.#writeLogFile(key, list);
        this.lastWrite = Date.now();
      }
    });
  }
  /** 延迟写入并清空缓存 */
  write = debounce((file: any) => this.flush(file), 1000);

  /** 检查日志文件的路径,如果目录不存在,则创建,最好返回有效的日志文件,如果文件已存在,则追加日志数据 */
  #checkFolder(output: string): void {
    const paths = this.#fs?.dirname?.(output || this.defaultLogFile) || '';

    const { existsSync, mkdirSync } = this.#fs || {};

    if (!existsSync?.(paths)) {
      mkdirSync?.(paths);
    }
  }
  #writeLogFile(outputFile: string, content: LogContent | LogContent[]): void {
    if (!isArray(content)) {
      content = [content];
    }

    outputFile = outputFile || this.defaultLogFile;
    this.#checkFolder(outputFile);

    const { writeFile } = this.#fs || {};

    if (outputFile && writeFile) {
      const list: string[] = content.reduce<string[]>(
        (o, { prefix = [], data }) => [...o, [...prefix, ...data.map(JSON.stringify as any), '\n'].join(' ')],
        [],
      );
      writeFile?.(outputFile, list.join(''), { flag: 'a' }, noop);
    }
  }
}
