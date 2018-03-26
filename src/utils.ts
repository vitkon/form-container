type Fn = (...args: any[]) => any;

export const pipe = (...fns: Fn[]) => (x: any) => fns.reduce((acc, fn) => fn(acc), x);

export const isEmpty = (value: object | null | undefined) => {
    if (value === null || value === undefined) {
        return true;
    }

    return Object.keys(value).length === 0;
};

export const isNil = (value: any) => value == null;
