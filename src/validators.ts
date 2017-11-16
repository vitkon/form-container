import { ValidationRule } from './interfaces';

export const isRequired: ValidationRule = (prop, errorMessage = `${prop} is a required field`) => [
    model => !!model[prop],
    { [prop]: errorMessage }
];

export const hasError: ValidationRule = (prop, errorMessage) => [
    (model) => false,
    { [prop]: errorMessage }
];