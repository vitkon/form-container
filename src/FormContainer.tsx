import * as React from 'react';
import { pipe, isNil, omit } from './utils';

import * as validation from './validate';
import SubmissionError from './SubmissionError';
import { IFormConfig, IBoundInput } from './interfaces';

const hoistNonReactStatics = require('hoist-non-react-statics');

const makeWrapper = <T extends {}>(config: IFormConfig<T>) => (WrappedComponent: any) => {
    class FormWrapper extends React.Component<any, any> {
        constructor(props: any, context: any) {
            super(props, context);
            this.state = {
                model: config.initialModel || {},
                touched: {},
                inputs: {},
                submitErrors: {}
            };
        }

        setModel = (model: { [name in keyof T]: any }) => {
            this.setState({ model });
            return model;
        };

        setProperty = (prop: keyof T, value: any) =>
            this.setState((prevState: any) => {
                return {
                    ...prevState,
                    model: {
                        ...prevState.model,
                        [prop]: value
                    }
                };
            });

        clearSubmitError = (prop: keyof T) =>
            this.setState((prevState: any) => {
                return {
                    ...prevState,
                    ...(prevState.submitErrors[prop] && {
                        submitErrors: omit(prevState.submitErrors, prop)
                    })
                };
            });

        setTouched = (touched: { [name in keyof T]: any }) => {
            this.setState({ touched });
            return touched;
        };

        setFieldToTouched = (prop: keyof T) =>
            this.setTouched(Object.assign({}, this.state.touched, { [prop]: true }));

        getValue = (name: keyof T) => {
            const { state: { model: { [name]: modelValue } } } = this;

            if (!isNil(modelValue)) {
                return modelValue;
            }

            return '';
        };

        bindToChangeEvent = (e: React.ChangeEvent<any>): void => {
            const { name, type } = e.target;
            let { value } = e.target;

            if (type === 'checkbox') {
                const oldCheckboxValue = this.state.model[name] || [];
                const newCheckboxValue = e.target.checked
                    ? oldCheckboxValue.concat(value)
                    : oldCheckboxValue.filter((v: string) => v !== value);

                value = newCheckboxValue;
            }

            this.setProperty(name, value);
            this.clearSubmitError(name);
        };

        bindToFocusEvent = (e: React.FocusEvent<any>): void => {};

        bindToBlurEvent = (e: React.FocusEvent<any>): void => {
            const target = e.target as HTMLInputElement;
            this.setFieldToTouched(target.name as keyof T);

            if (config.onInputBlur) {
                config.onInputBlur(e);
            }
        };

        bindInput = (name: keyof T): IBoundInput => ({
            name,
            value: this.getValue(name),
            onChange: this.bindToChangeEvent,
            onFocus: this.bindToFocusEvent,
            onBlur: this.bindToBlurEvent
        });

        bindNativeInput = (name: keyof T): IBoundInput => ({
            ...this.bindInput(name),
            ref: (input: HTMLInputElement) => {
                if (!this.state.inputs[name]) {
                    this.setState({
                        inputs: {
                            ...this.state.inputs,
                            [name]: input
                        }
                    });
                }
            }
        });

        handleSubmit = (submit: (model: any) => Promise<any>) => () => {
            return submit(this.state.model).catch((error: any) => {
                const submitErrors = error instanceof SubmissionError ? error.errors : undefined;
                if (submitErrors) {
                    this.setState({ submitErrors });
                    return submitErrors;
                } else {
                    throw error;
                }
            });
        };

        render() {
            const nextProps: any = Object.assign({}, this.props, {
                form: {
                    model: this.state.model,
                    inputs: this.state.inputs,
                    touched: this.state.touched,
                    submitErrors: this.state.submitErrors
                },
                formMethods: {
                    bindInput: this.bindInput,
                    bindNativeInput: this.bindNativeInput,
                    bindToChangeEvent: this.bindToChangeEvent,
                    clearSubmitError: this.clearSubmitError,
                    setProperty: this.setProperty,
                    setModel: this.setModel,
                    setFieldToTouched: this.setFieldToTouched,
                    handleSubmit: this.handleSubmit
                }
            });

            const finalProps = config.middleware ? config.middleware(nextProps) : nextProps;

            return React.createElement(WrappedComponent, finalProps);
        }
    }

    return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export const connectForm = <T extends {} = any>(
    validators: any[] = [],
    config: IFormConfig<T> = {}
) => (Component: any) => pipe(validation.validate(validators), makeWrapper<T>(config))(Component);
