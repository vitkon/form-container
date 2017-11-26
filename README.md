# Form Container

[![Build Status](https://travis-ci.org/vitkon/form-container.svg?branch=master)](https://travis-ci.org/vitkon/form-container) [![npm version](https://img.shields.io/npm/v/form-container.svg?style=flat)](https://www.npmjs.com/package/form-container) [![Coverage Status](https://coveralls.io/repos/github/vitkon/form-container/badge.svg?branch=master)](https://coveralls.io/github/vitkon/form-container?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/vitkon/form-container.svg)](https://greenkeeper.io/)

Form container is a lightweight React form container with validation (written in TypeScript).
It allows you to use both HTML5 form validation and custom validation functions.

It provides your child form with 2 objects of props:
- `form` - all data on your form values, states and errors
- `formMethods` - methods to bind you input controllers and manipulate the form model

## Installation
Form Container is available as the `form-container` package on npm.

Install it in your project with `npm` or `yarn`

```bash
npm install form-container
```
or
```bash
yarn add form-container
```

## Getting started

<a id="connectForm"></a>
### `connectForm([validators], [formConfig])(WrappedComponent)`
`form-container` exposes `connectForm` function to connect an arbitrary form component (`WrappedComponent`).
It does not modify the component class passed to it; instead, it *returns* a new, connected component class for you to use.

<a id="connect-form-arguments"></a>
#### Arguments

* [`validators: ValidationRule[]`] \(*Array*): An array of rules can be provided to validate the form model against them. Rules are executed in a sequence that is defined in the array.  

* [`formConfig: IFormConfig`] \(*Object*): An object contains initial configuration for the form  

    - `initialModel: Partial<T>` — object provides initial values to the form fields
    - `middleware: (props: T) => any` — function transforms props passed to the wrapped component
    - `onInputBlur: (e: React.ForcusEvent<any>) => any` — function is called on every blur on an input field within the form. Adding a custom `onBlur` to the input field itself is not recommended, use this method instead

## Validation


### HTML5 validation example

```javascript
import * as React from 'react';

// bare minimum import
import { connectForm, IFormProps } from 'form-container';

// IFormProps interface contains the props that are passed down from form-container
interface IProps extends IFormProps {}

export class Form extends React.Component<IProps, {}> {
    handleSubmit = (e: any) => {
        e.preventDefault();
        const { model } = this.props.form;
        console.log(model);
    }

    render() {
        const { validationErrors, touched } = this.props.form;
        const { bindInput } = this.props.formMethods;
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        Required field
                        <input
                            {/* HTML attribute to validate required field */}
                            required="true"
                            {/* this is how you bind input to a form-container */}
                            {...bindInput('test')}
                        />
                        <small>{touched.test && validationErrors.test}</small>
                    </label>
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        );
    }
}

// no custom validators
const validators: any[] = [];

const formConfig = {
    initialModel: {
        test: 'foo'
    }
}

// attaching our Form to form-container with validation
export default connectForm(validators, formConfig)(Form);
```

### Custom validation example
```javascript
// components/Form.tsx
import * as React from 'react';
import { connectForm, IFormProps } from 'form-container';

interface IProps extends IFormProps {}

// arbitrary form component
export class Form extends React.PureComponent<IProps, {}> {
    render() {
        const { validationErrors, touched } = this.props.form;
        const { bindInput } = this.props.formMethods;
        return (
            <form>
                <div>
                    <label>
                        Test:
                        <input
                            {/* this is how you bind input to a form-container */}
                            {...bindInput('test')}
                        />
                        <small>{touched.test && validationErrors.test}</small>
                    </label>
                </div>
            </form>
        );
    }
}

// custom validator
const hasMoreThanFiveChars: ValidationRule = (prop, errorMessage = `${prop} is less than 5 chars`) => [
    model => model[prop] ? model[prop].length >= 5 : true,
    { [prop]: errorMessage }
];

// all validators for the form
const validators = [
    isRequired('test'),
    hasMoreThanFiveChars('test')
];

// attaching our Form to form-container with validation
export default connectForm(validators)(Form);
```
