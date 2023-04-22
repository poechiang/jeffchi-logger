import { IFileHelper } from '../interface';

/**
 * 检查当前运行环境,node环境下返回node的fs模块,浏览器环境返回null
 * @returns fs
 */
export const checkPlatform = (): Promise<IFileHelper | null> =>
  Promise.all([import('fs'), import('path')])
    .then(([fs, path]) => {
      // 如果fs为空则判定当前为浏览器环境
      if (!fs) return null;
      const { existsSync, mkdirSync, writeFile } = fs;
      const { sep, resolve, join, dirname } = path;
      return {
        existsSync,
        mkdirSync,
        writeFile,
        join,
        sep,
        resolve,
        dirname,
      };
    })
    .catch(() => null);
