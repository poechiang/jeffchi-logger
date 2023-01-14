import { LogMode } from '../interface';

export const checkLogMode = (env: LogMode) => (env === 'all' || process.env.NODE_ENV === env) && console !== undefined;
