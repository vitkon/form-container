import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import * as validation from '../validate';
import { ValidationType, Condition } from '../interfaces';
import { ValidationRuleFactory } from '../validators';
import { Control } from '../FormContainer';
const hoistNonReactStatics = require('hoist-non-react-statics');

const isRequired: Condition = value => !!value;
const required = ValidationRuleFactory(isRequired, 'This field is required');

const initialFormProps = {
    model: {},
    shouldValidate: {},
    validationErrors: {},
    validationWarnings: {}
};

describe('Validation', () => {
    describe('validate error validator', () => {
        it('should return a valid result of validationFn execution', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = { form: { ...initialFormProps, model: { foo: 'test' } } };
            const result = validation.validate([required('foo', 'Required field')])(
                MockComponent as any
            )(props);
            expect(result.props).toEqual({
                form: {
                    ...initialFormProps,
                    isValid: true,
                    model: {
                        foo: 'test'
                    }
                }
            });
        });

        it('should return a invalid result of validationFn execution', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = {
                form: {
                    ...initialFormProps,
                    model: {
                        foo: ''
                    }
                }
            };
            const result = validation.validate([required('foo', 'Required field')])(
                MockComponent as any
            )(props);
            expect(result.props).toEqual({
                form: {
                    ...initialFormProps,
                    isValid: false,
                    model: {
                        foo: ''
                    },
                    validationErrors: {
                        foo: 'Required field'
                    }
                }
            });
        });
    });

    describe('validate warning validator', () => {
        it('should return a valid result of validationFn execution', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = { form: { ...initialFormProps, model: { foo: 'test' } } };
            const result = validation.validate([
                required('foo', 'Required field', ValidationType.Warning)
            ])(MockComponent as any)(props);
            expect(result.props).toEqual({
                form: {
                    ...initialFormProps,
                    isValid: true,
                    model: {
                        foo: 'test'
                    }
                }
            });
        });

        it('should return a invalid result of validationFn execution', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = {
                form: {
                    ...initialFormProps,
                    model: {
                        foo: ''
                    }
                }
            };
            const result = validation.validate([
                required('foo', 'Required field', ValidationType.Warning)
            ])(MockComponent as any)(props);
            expect(result.props).toEqual({
                form: {
                    ...initialFormProps,
                    isValid: true,
                    model: {
                        foo: ''
                    },
                    validationWarnings: {
                        foo: 'Required field'
                    }
                }
            });
        });

        it('should conditionally validate', () => {
            const MockComponent = (props: any) => {
                const { formMethods: { bindInput }, form } = props;
                return (
                    <form>
                        <Control name="foo" shouldValidate={false} {...props}>
                            <input />
                        </Control>
                    </form>
                );
            };
            const props = {
                form: {
                    ...initialFormProps,
                    model: {
                        foo: ''
                    },
                    shouldValidate: {
                        foo: false
                    }
                }
            };

            const result = validation.validate([required('foo')])(MockComponent as any)(props);
            expect(result.props).toEqual({
                form: {
                    ...initialFormProps,
                    isValid: true,
                    model: {
                        foo: ''
                    },
                    shouldValidate: {
                        foo: false
                    }
                }
            });
        });
    });
});
