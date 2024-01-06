/**
 * node console colors
 */

for (let r = 0; r < 6; r++) {
  let fmt = '';
  let args = [];
  for (let c = 0; c < 20; c++) {
    const v = (r * 20 + c).toString().padStart(3, '0');
    fmt += `\x1B[${v}m%s\x1b[m `;
    args.push(v);
  }
  console.log(fmt, ...args);
}
console.log(1, '\x1b[36m', 2, '\\x1b[36m');
console.assert(1, '\x1b[36m', 2, '\\x1b[36m');
console.assert(0, '%s%s%s %s%s%s %s%s%s', '\x1b[31m', 2, '\x1b[m', '\x1b[32m', 7, '\x1b[m', '\x1b[36m', 3, '\x1b[m');
