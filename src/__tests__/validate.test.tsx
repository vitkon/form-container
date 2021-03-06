import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import * as validation from '../validate';
import { ValidationType, Condition } from '../interfaces';
import { ValidationRuleFactory } from '../validators';
const hoistNonReactStatics = require('hoist-non-react-statics');

const isRequired: Condition = value => !!value;
const required = ValidationRuleFactory(isRequired, 'This field is required');

describe('Validation', () => {
    describe('validate error validator', () => {
        it('should return a valid result of validationFn execution', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = {
                form: {
                    model: {
                        foo: 'test'
                    }
                }
            };
            const result = validation.validate([required('foo', 'Required field')])(
                MockComponent as any
            )(props);
            expect(result.props).toEqual({
                form: {
                    isValid: true,
                    model: {
                        foo: 'test'
                    },
                    validationErrors: {},
                    validationWarnings: {}
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
                    isValid: false,
                    model: {
                        foo: ''
                    },
                    validationErrors: {
                        foo: 'Required field'
                    },
                    validationWarnings: {}
                }
            });
        });

        it('should return false for isValid where there are submitErrors', () => {
            const MockComponent = ({ formMethods: { bindInput }, form }) => (
                <form>
                    <input {...bindInput('foo')} />
                </form>
            );
            const props = {
                form: {
                    model: {
                        foo: 'boo'
                    },
                    submitErrors: {
                        foo: 'Submit error'
                    }
                }
            };
            const result = validation.validate([required('foo', 'Required field')])(
                MockComponent as any
            )(props);
            expect(result.props).toEqual({
                form: {
                    isValid: false,
                    model: {
                        foo: 'boo'
                    },
                    submitErrors: {
                        foo: 'Submit error'
                    },
                    validationErrors: {},
                    validationWarnings: {}
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
            const props = {
                form: {
                    model: {
                        foo: 'test'
                    }
                }
            };
            const result = validation.validate([
                required('foo', 'Required field', ValidationType.Warning)
            ])(MockComponent as any)(props);
            expect(result.props).toEqual({
                form: {
                    isValid: true,
                    model: {
                        foo: 'test'
                    },
                    validationErrors: {},
                    validationWarnings: {}
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
                    isValid: true,
                    model: {
                        foo: ''
                    },
                    validationErrors: {},
                    validationWarnings: {
                        foo: 'Required field'
                    }
                }
            });
        });
    });
});
