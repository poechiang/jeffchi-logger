import { format } from 'date-fns';
import { LogContent } from '../interface';
import noop from './noop';

export const writeLogFile = (writer: any, data: LogContent): void =>
  writer?.(
    `logs/${format(Date.now(), 'yyyy-MM-dd')}.log`,
    data.map(JSON.stringify as any).join(' ') + '\n',
    { flag: 'a' },
    noop,
  );
