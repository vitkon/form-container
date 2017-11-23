import { ValidationRule } from './interfaces';

export const ValidationRuleFactory: any = (
    validationFn: (value: any, allProps?: any) => boolean,
    errorMessage: string
): ValidationRule =>
    (prop, message = errorMessage) => [
        (model, allProps) => validationFn(model[prop], allProps),
        { [prop]: message }
    ];


export const isRequired: ValidationRule = ValidationRuleFactory(
    (value: any) => !!value,
    'Required field'
);

export const hasError: ValidationRule = ValidationRuleFactory(
    (value: any) => false,
    'Error'
);
