[![Build Status](https://travis-ci.org/vitkon/form-container.svg?branch=master)](https://travis-ci.org/vitkon/form-container) [![npm version](https://img.shields.io/npm/v/form-container.svg?style=flat)](https://www.npmjs.com/package/form-container) [![Coverage Status](https://coveralls.io/repos/github/vitkon/form-container/badge.svg?branch=master)](https://coveralls.io/github/vitkon/form-container?branch=master)

# Form Container

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

## Validation

### HTML5 validation example

```javascript
import * as React from 'react';

// bare minimum import
import { connectForm, IFormProps } from 'form-container';

// IFormProps interface contains the props that are passed down from form-container
interface IProps extends IFormProps {}

export class Form extends React.Component<IProps, {}> {
    render() {
        const { validationErrors, touched } = this.props.form;
        const { bindInput } = this.props.formMethods;
        return (
            <form>
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
            </form>
        );
    }
}

// no custom validators
const validators: any[] = [];

// attaching our Form to form-container with validation
export default connectForm(validators)(Form);
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
