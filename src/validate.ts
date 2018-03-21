import * as React from 'react';
import { get, isEmpty, forEach } from 'lodash';
import { hasError } from './validators';
import { ComponentInstance, ValidationType, ValidationRuleResult, IFormProps } from './interfaces';

const hoistNonReactStatics = require('hoist-non-react-statics');

const getValidationResult = ({
    allProps,
    model,
    rules,
    validationType
}: {
    allProps: any;
    model: { [name in string]: any };
    rules: ValidationRuleResult[];
    validationType: ValidationType;
}) =>
    rules
        .filter(([rule, field, type = ValidationType.Error]) => type === validationType)
        .reduce((errors, [rule, field, type]) => {
            const isValid = rule(model, allProps);

            if (isValid) {
                return errors;
            }

            return {
                ...errors,
                ...field
            };
        }, {});

const inferRulesFromAttributes = (rules: any[], { inputs }: any) => {
    const extendedRules = [...rules];

    forEach(inputs, (input: any) => {
        if (get(input, 'validity.valid') === false) {
            const rule = hasError(input.name, input.validationMessage);
            extendedRules.push(rule);
        }
    });

    return extendedRules;
};

export const validate = (rules: ValidationRuleResult[] = []) => (
    WrappedComponent: ComponentInstance
) => {
    const validated = (props: IFormProps) => {
        const extendedRules = inferRulesFromAttributes(rules, props.form);
        const validationErrors = getValidationResult({
            allProps: props,
            rules: extendedRules,
            model: props.form.model,
            validationType: ValidationType.Error
        });

        const validationWarnings = getValidationResult({
            allProps: props,
            rules,
            model: props.form.model,
            validationType: ValidationType.Warning
        });

        return React.createElement(
            WrappedComponent,
            Object.assign({}, props, {
                form: {
                    ...props.form,
                    isValid: isEmpty(validationErrors),
                    validationErrors,
                    validationWarnings
                }
            })
        );
    };

    return hoistNonReactStatics(validated, WrappedComponent);
};
