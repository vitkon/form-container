# Form Container

[![Build Status](https://travis-ci.org/vitkon/form-container.svg?branch=master)](https://travis-ci.org/vitkon/form-container) [![npm version](https://img.shields.io/npm/v/form-container.svg?style=flat)](https://www.npmjs.com/package/form-container) [![Coverage Status](https://coveralls.io/repos/github/vitkon/form-container/badge.svg?branch=master)](https://coveralls.io/github/vitkon/form-container?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/vitkon/form-container.svg)](https://greenkeeper.io/)

Form container is a lightweight React form container with validation (written in TypeScript).
It allows you to use both HTML5 form validation and custom validation functions.

## TL;DR

It provides your child form with 2 objects of props:

*   `form` - all data on your form values, states, errors and warnings
*   `formMethods` - methods to bind your input controllers and manipulate the form model

### Demos:

*   [Material UI login form](https://codesandbox.io/embed/1r1kw355m4)  
    `form-container` with `material-ui` controls

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
It does not modify the component class passed to it; instead, it _returns_ a new, connected component class for you to use.

<a id="connect-form-arguments"></a>

#### Arguments

*   [`validators: ValidationRule[]`] \(_Array_): An array of rules can be provided to validate the form model against them. Rules are executed in a sequence that is defined in the array.

*   [`formConfig: IFormConfig`] \(_Object_): An object contains initial configuration for the form

    *   `initialModel: Partial<T>` — object provides initial values to the form fields
    *   `middleware: (props: T) => T & M` — function transforms props passed to the wrapped component
    *   `onInputBlur: (e: React.ForcusEvent<any>) => void` — function is called on every blur on an input field within the form. Adding a custom `onBlur` to the input field itself is not recommended, use this method instead

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
        const { bindInput, bindNativeInput } = this.props.formMethods;
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        Required field
                        <input
                            {/* HTML attribute to validate required field */}
                            required={true}
                            {/* this is how you bind input to a form-container */}
                            {...bindNativeInput('test')}
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
import { connectForm, ValidationRuleFactory, Condition, IFormProps } from 'form-container';

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
const hasMoreThan6Chars: Condition = value => (value ? value.length > 6 : true);
export const strongPassword = ValidationRuleFactory(
    hasMoreThan6Chars,
    'We recommend password to contain more than 6 characters for security purposes',
    'warning'
);

// all validators for the form
const validators = [
    isRequired('test'),
    strongPassword('test')
];

// attaching our Form to form-container with validation
export default connectForm(validators)(Form);
```

### Submit validation example

Form Container exposes `SubmissionError`, a throwable error which can be used to set submit validation for fields in response to promise rejection because of validation errors.

A wrapped form component has access to `handleSubmit` via `formMethods`:

### `handleSubmit([submit])`

#### Arguments

*   [`submit: (model) => Promise`]: A submit handler function which has access to the form model and returns a Promise.

Inside the provided `submit` function you can throw a `SubmissionError` which will be caught by `handleSubmit`, and the submission errors will be set for each key in the form state under a key `submitErrors`, e.g.:

```javascript
throw new SubmissionError({
    test: "Don't like this..."
});
```

```javascript
// components/Form.tsx
import * as React from 'react';
import { connectForm, ValidationRuleFactory, Condition, IFormProps } from 'form-container';

interface IProps extends IFormProps {}

interface IFormModel {
    test: string;
}

// arbitrary form component
export class Form extends React.PureComponent<IProps, {}> {
    submit = (model: IFormModel) => {
        return fetch('http://dummyurl.com', {
            method: 'POST',
            body: model
        }) // your Promise based HTTP client of choice
            .catch(error => {
                const { data: { code }, status } = error.response;
                if (status === 422 && code === 'xyz') {
                    throw new SubmissionError({
                        foo: "Back-end doesn't like this..."
                    });
                } else {
                    /// handle other errors accordingly
                }
            });
    };

    render() {
        const { validationErrors, submitErrors, touched } = this.props.form;
        const { bindInput, handleSubmit } = this.props.formMethods;
        return (
            <form>
                <div>
                    <label>
                        Test:
                        <input {...bindInput('test')} />
                        <small>
                            {(touched.test && validationErrors.test) || submitErrors.test}
                        </small>
                    </label>
                </div>
                <button onClick={handleSubmit(this.submit)} />
            </form>
        );
    }
}

export default connectForm<IFormModel>()(Form);
```
