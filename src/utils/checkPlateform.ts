/**
 * 检查当前运行环境,node环境下返回node的fs模块,浏览器环境返回null
 * @returns fs
 */
export const checkPlatform = () =>
  import('fs').then((fs) => {
    // 如果fs为空则判定当前为浏览器环境
    if (!fs) return null;

    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }

    return fs?.writeFile;
  });
