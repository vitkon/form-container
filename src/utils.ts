type Fn = (...args: any[]) => any;

export const pipe = (...fns: Fn[]) => (x: any) => fns.reduce((acc, fn) => fn(acc), x);

export const isEmpty = (value: object | null | undefined) => {
    if (value === null || value === undefined) {
        return true;
    }

    return Object.keys(value).length === 0;
};

export const isNil = (value: any) => value == null;

export const omit = (obj: object, omitKey: string | number | symbol) => {
    return Object.keys(obj).reduce((result, key) => {
        if (key !== omitKey) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};
