import * as React from 'react';
import { flow, isNil } from 'lodash';
import * as validation from './validate';
import { IFormConfig, IBoundInput } from './interfaces';

const hoistNonReactStatics = require('hoist-non-react-statics');

const makeWrapper = <T extends {}>(config: IFormConfig) => (WrappedComponent: any) => {
    class FormWrapper extends React.Component<any, any> {
        constructor(props: any, context: any) {
            super(props, context);
            this.state = {
                model: config.initialModel || {},
                touched: {},
                inputs: {}
            };

        }

        setModel = (model: {
            [name in keyof T]: any
            }) => {
            this.setState({ model });
            return model;
        }

        setProperty = (prop: keyof T, value: any) => this.setModel(
            Object.assign(
                {},
                this.state.model,
                { [prop]: value }
            )
        )

        setTouched = (touched: {
            [name in keyof T]: any
            }) => {
            this.setState({ touched });
            return touched;
        }

        setFieldToTouched = (prop: keyof T) => this.setTouched(
            Object.assign(
                {},
                this.state.touched,
                { [prop]: true }
            )
        )

        getValue = (name: keyof T) => {
            const {
                state: { model: { [name]: modelValue } }
            } = this;

            if (!isNil(modelValue)) {
                return modelValue;
            }

            return '';
        }

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
        }

        bindToFocusEvent = (e: React.FocusEvent<any>): void => {
        }

        bindToBlurEvent = (e: React.FocusEvent<any>): void => {
            const target = e.target as HTMLInputElement;
            this.setFieldToTouched(target.name as keyof T);

            if (config.onInputBlur) {
                config.onInputBlur(e);
            }
        }

        bindInput = (name: keyof T): IBoundInput => ({
            name,
            value: this.getValue(name),
            onChange: this.bindToChangeEvent,
            onFocus: this.bindToFocusEvent,
            onBlur: this.bindToBlurEvent,
            ref: (input: any) => { 
                if (!this.state.inputs[name]) {
                    this.setState({
                        inputs: {
                            ...this.state.inputs,
                            [name]: input
                        }
                    }); 
                }
            }
        })

        render() {
            const nextProps = Object.assign({}, this.props, {
                form: {
                    model: this.state.model,
                    inputs: this.state.inputs,
                    touched: this.state.touched,
                },
                formMethods: {
                    bindInput: this.bindInput,
                    bindToChangeEvent: this.bindToChangeEvent,
                    setProperty: this.setProperty,
                    setModel: this.setModel,
                    setFieldToTouched: this.setFieldToTouched
                }
            });

            const finalProps = config.middleware
                ? config.middleware(nextProps)
                : nextProps;

            return React.createElement(WrappedComponent, finalProps);
        }
    }

    return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export const connectForm = <T extends {} = any>(
    validators: any[] = [],
    config: IFormConfig<T> = {}
) => (Component: any) => (
    flow([
        validation.validate(validators),
        makeWrapper<T>(config)
    ])(Component)
);
