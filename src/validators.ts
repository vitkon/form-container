import { ValidationRule, ValidationType } from './interfaces';

export const ValidationRuleFactory: any = (
    validationFn: (value: any, allProps?: any) => boolean,
    errorMessage: string,
    errorType = ValidationType.Error
): ValidationRule => (prop, message = errorMessage, type: ValidationType = errorType) => [
    (model, allProps) => validationFn(model[prop], allProps),
    { [prop]: message },
    type
];

export const hasError = ValidationRuleFactory((value: any) => false, 'Error');
