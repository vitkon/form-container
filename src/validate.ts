import * as React from 'react';
import { get, isEmpty, forEach } from 'lodash';
import { hasError } from './validators';
import { ComponentInstance, IFormConfig } from './interfaces';

const hoistNonReactStatics = require('hoist-non-react-statics');

const getValidationErrors = (rules: any[], model: { [name in string]: any }, allProps: any) =>
    rules.reduce((errors, [rule, field]) => {
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

export const validate = ({ errors, warnings }: IFormConfig) => (
    WrappedComponent: ComponentInstance
) => {
    const validated = (props: any) => {
        let extendedErrors = [];
        let validationErrors = {};
        let validationWarnings = {};

        if (errors) {
            extendedErrors = inferRulesFromAttributes(errors, props.form);
            validationErrors = getValidationErrors(extendedErrors, props.form.model, props);
        }

        if (warnings) {
            validationWarnings = getValidationErrors(warnings, props.form.modal, props);
        }

        return React.createElement(
            WrappedComponent,
            Object.assign({}, props, {
                form: {
                    ...props.form,
                    isValid: isEmpty(validationErrors),
                    errors: validationErrors,
                    warnings: validationWarnings
                }
            })
        );
    };

    return hoistNonReactStatics(validated, WrappedComponent);
};
