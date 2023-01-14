import { format } from 'date-fns';
import path from 'path';
import { IFileHelper } from '../interface';
import noop from './noop';
interface LogContent {
  prefix?: (string | Date)[];
  data: any[];
  outputFile?: string;
}
/** 检查日志文件的路径,如果目录不存在,则创建,最好返回有效的日志文件,如果文件已存在,则追加日志数据 */
const checkFolder = (fs: IFileHelper | null, output?: string): string => {
  if (!fs) {
    return '';
  }
  const fullPath = output || `logs${fs?.sep}${format(Date.now(), 'yyyy-MM-dd')}.log`;
  const paths = path.dirname(fullPath);

  const { existsSync, mkdirSync } = fs;

  if (!existsSync?.(paths)) {
    mkdirSync?.(paths);
  }
  return fullPath;
};
export const writeLogFile = (fs: IFileHelper | null, { prefix = [], outputFile, data }: LogContent): void => {
  if (!fs) return;

  const { writeFile } = fs;

  const logFile = checkFolder(fs, outputFile);

  if (logFile && writeFile) {
    writeFile?.(logFile, [...prefix, ...data.map(JSON.stringify as any), '\n'].join(' '), { flag: 'a' }, noop);
  }
};
