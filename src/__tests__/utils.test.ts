import { omit, isNil, isEmpty, pipe } from '../utils';

describe('utils', () => {
    describe('omit', () => {
        const obj = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };

        it('omits specifed property from given object', () => {
            expect(omit(obj, 'f')).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
        });

        it('ignores invalid properties', () => {
            expect(omit(obj, 'boo')).toEqual(obj);
        });
    });

    describe('isNil', () => {
        it('returns true if value is `null` or `undefined`', () => {
            expect(isNil(null)).toEqual(true);
            expect(isNil(undefined)).toEqual(true);
            expect(isNil([])).toEqual(false);
            expect(isNil({})).toEqual(false);
            expect(isNil(0)).toEqual(false);
            expect(isNil('')).toEqual(false);
        });
    });

    describe('isEmpty', () => {
        it('returns true for null', () => {
            expect(isEmpty(null)).toEqual(true);
        });

        it('returns true for undefined', () => {
            expect(isEmpty(undefined)).toEqual(true);
        });

        it('returns true for empty object', () => {
            expect(isEmpty({})).toEqual(true);
            expect(isEmpty({ x: 0 })).toEqual(false);
        });
    });

    describe('pipe', () => {
        const multiplyByTwo = (i: number) => i * 2;
        const addFour = (i: number) => i + 4;
        const divideByFour = (i: number) => i / 4;

        it('can handle one function argument', () => {
            expect(pipe(multiplyByTwo)(4)).toEqual(8);
        });

        it('can handle multiple function arguments', () => {
            expect(pipe(multiplyByTwo, addFour, divideByFour)(4)).toEqual(3);
        });
    });
});
