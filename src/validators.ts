import { ValidationRule, ErrorMessage, Validator, ValidationType } from './interfaces';

export const ValidationRuleFactory: any = (
    validationFn: (value: any, allProps?: any) => boolean,
    errorMessage: string,
    errorType = ValidationType.Error
): ValidationRule => (
    prop,
    message = errorMessage,
    type = errorType
): [Validator, ErrorMessage, ValidationType] => [
    (model, allProps) => validationFn(model[prop], allProps),
    { [prop]: message },
    type
];

export const isRequired = ValidationRuleFactory((value: any) => !!value, 'Required field');

export const hasError = ValidationRuleFactory((value: any) => false, 'Error');
