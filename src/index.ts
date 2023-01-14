import { format } from 'date-fns';
import { noop } from 'lodash';
import { buildOutputPreffix, checkEnv, checkPlatform } from './utils';

const defOptions: Logger.IOptions = {
    date: true,
    env: 'all',
};

export const loggerWithTags = (
    tags: string | string[],
    options?: Logger.IOptions,
) => {
    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    const { env, ...mergedOptions } = { ...defOptions, ...(options || {}) };

    const debug = (...rest: any[]) => {
        const prefix = buildOutputPreffix(tags as string[], mergedOptions);
        checkEnv(env || 'all') && console.debug(prefix, ...rest);
    };
    const info = (...rest: any[]) => {
        const prefix = buildOutputPreffix(tags as string[], mergedOptions);
        checkEnv(env || 'all') && console.info(prefix, ...rest);
    };
    const log = (...rest: any[]) => {
        const prefix = buildOutputPreffix(tags as string[], mergedOptions);
        checkEnv(env || 'all') && console.log(...prefix, ...rest);
        checkPlatform().then((write) =>
            write?.(
                `logs/${format(Date.now(), 'yyyy-MM-dd')}.log`,
                [...prefix, ...rest.map(JSON.stringify as any), '\n'].join(' '),
                { flag: 'a' },
                noop,
            ),
        );
    };
    const warn = (...rest: any[]) => {
        const prefix = buildOutputPreffix(tags as string[], mergedOptions);
        checkEnv(env || 'all') && console.warn(prefix, ...rest);
    };

    const error = (msg: string) => {
        const prefix = buildOutputPreffix(tags as string[], mergedOptions);
        if (checkEnv(env || 'all')) {
            console.warn(prefix);
            throw new Error(msg);
        }
    };
    return { debug, info, log, warn, error };
};
