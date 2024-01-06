import { LogMode } from '../interface';

export const checkEnv = (env: LogMode) => (env === 'all' || process.env.NODE_ENV === env) && console !== undefined;
