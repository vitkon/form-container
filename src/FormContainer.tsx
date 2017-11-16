import * as React from 'react';
import { isNil, flow } from 'lodash';
import { validate } from './validate';
import { ComponentInstance } from './interfaces';

const hoistNonReactStatics = require('hoist-non-react-statics');

export interface IFormProps<T = any> {
    form: {
        model: any;
        inputs: any;
        isValid?: boolean;
        validationErrors: { [key: string]: string };
        touched: { [key: string]: boolean };
    };
    formMethods: {
        bindInput: (name: string) => any;
        bindToChangeEvent: (e: React.ChangeEvent<any>) => void;
        setProperty: (prop: keyof T, value: T[keyof T]) => any;
        setModel: (model: {
            [name in keyof T]?: any
        }) => any;
        setFieldToTouched: (prop: keyof T) => any;
    };
    initialModel?: any;
}

const makeWrapper = <T extends {}>(middleware?: any) => (WrappedComponent: ComponentInstance) => {
    class FormWrapper extends React.Component<any, any> {
        constructor(props: any, context: any) {
            super(props, context);
            this.state = {
                model: props.initialModel || {},
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

        bindToChangeEvent = (e: React.ChangeEvent<any>) => {
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

        bindToFocusEvent = (e: React.FocusEvent<any>) => {
            const target = e.target as HTMLInputElement;
            this.setFieldToTouched(target.name as keyof T);
        }

        bindToBlurEvent = (e: React.FocusEvent<any>) => {
            // do something
        }

        bindInput = (name: keyof T) => ({
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

            const finalProps = typeof middleware === 'function'
                ? middleware(nextProps)
                : nextProps;

            return React.createElement(WrappedComponent, finalProps);
        }
    }

    return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export default (validators: any[] = []) => (Component: any) => (
    flow([
        validate(validators),
        makeWrapper()
    ])(Component)
);
