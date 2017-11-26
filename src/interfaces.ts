import * as React from 'react';
export type ComponentInstance<P = any, S = any> = new () => React.Component<P, S>


export type Validator = (model: any, allProps?: any) => boolean
export type ErrorMessage = {
    [name: string]: string | undefined
}

export type ValidationRule = <T = any>(prop: keyof T, errorMessage: string, attr?: any) => [
    Validator,
    ErrorMessage
];

export interface IFormProps<T = any> {
    form: {
        model: any;
        inputs: any;
        isValid?: boolean;
        validationErrors: { [key: string]: string };
        touched: { [key: string]: boolean };
    };
    formMethods: {
        bindInput: (name: string) => any;
        bindToChangeEvent: (e: React.ChangeEvent<any>) => void;
        setProperty: (prop: keyof T, value: T[keyof T]) => any;
        setModel: (model: {
            [name in keyof T]?: any
        }) => any;
        setFieldToTouched: (prop: keyof T) => any;
    };
    initialModel?: any;
}

export interface IFormConfig<T = any> {
    initialModel?: Partial<T>;
    onInputBlur?: (e: React.FocusEvent<any>) => any;
    middleware?: (props: T) => any;
}