import * as React from 'react';
export type ComponentInstance<P = any, S = any> = new () => React.Component<P, S>;

export type Validator = (model: any, allProps?: any) => boolean;

export type ErrorMessage = {
    [name: string]: string | undefined;
};

export type Condition = (value: string) => boolean;

export type ValidationRule = <T = any>(
    prop: keyof T,
    errorMessage: string,
    type?: ValidationType
) => ValidationRuleResult;

export type ValidationRuleResult = [Validator, ErrorMessage, ValidationType];

export enum ValidationType {
    Error = 'error',
    Warning = 'warning'
}

export interface IBoundInput {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<any>) => void;
    onFocus: (e: React.FocusEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    ref?: (input: any) => void;
}

export interface IFormMethods<T = any> {
    bindInput: (name: keyof T) => IBoundInput;
    bindNativeInput: (name: keyof T) => IBoundInput;
    bindToChangeEvent: (e: React.ChangeEvent<any>) => void;
    setProperty: (prop: keyof T, value: T[keyof T]) => any;
    setModel: (model: { [name in keyof T]?: any }) => any;
    setFieldToTouched: (prop: keyof T) => any;
}

export interface IFormProps<T = any> {
    form: {
        model: any;
        inputs: any;
        isValid?: boolean;
        validationErrors: { [key in keyof T]: string };
        validationWarnings: { [key in keyof T]: string };
        touched: { [key: string]: boolean };
    };
    formMethods: IFormMethods<T>;
    initialModel?: any;
}

export interface IFormConfig<T = object, M = object> {
    initialModel?: Partial<T>;
    onInputBlur?: (e: React.FocusEvent<any>) => any;
    middleware?: (props: T) => T & M;
}
