import { IFileHelper } from '../interface';

export const isWindows = () => {
  return process.platform === 'win32';
};

export const isMac = () => {
  return process.platform === 'darwin';
};

export const isLinux = () => {
  return process.platform === 'linux';
};

export const isNode = () => {
  return typeof window === 'undefined';
};

export const isBrowser = () => {
  return typeof window !== 'undefined';
};

/**
 * 检查当前运行环境,node环境下返回node的fs模块,浏览器环境返回null
 * @returns fs
 */
export const checkPlatform = (): Promise<IFileHelper | null> => {
  if (isBrowser()) {
    return Promise.resolve(null);
  }
  return Promise.all([import('fs'), import('path')])
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
};
